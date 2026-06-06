import { createTransformer } from './transformBookmarks'

// Test fixtures
const mockBookmarks = {
  leaf: {
    id: '1',
    title: 'Example Site',
    url: 'https://example.com',
  },

  folder: {
    id: '2',
    title: 'My Folder',
    children: [
      {
        id: '3',
        title: 'Link 1',
        url: 'https://site1.com',
      },
      {
        id: '4',
        title: 'Link 2',
        url: 'https://site2.com',
      },
    ],
  },

  nestedFolder: {
    id: '5',
    title: 'Root',
    children: [
      {
        id: '6',
        title: 'Subfolder',
        children: [
          { id: '7', title: 'Deep Link', url: 'https://deep.com' },
        ],
      },
    ],
  },

  withSpecialChars: {
    id: '8',
    title: 'Link with [brackets] and **bold**',
    url: 'https://example.com',
  },
} satisfies Record<string, browser.bookmarks.BookmarkTreeNode>

describe('transformBookmarks', () => {
  it('should transform a single bookmark link', () => {
    const transformer = createTransformer({ isObsidianFormat: false })
    const result = transformer(mockBookmarks.leaf)
    expect(result).toContain('[Example Site](https://example.com)')
  })

  it('should escape markdown special characters in titles', () => {
    const transformer = createTransformer({})
    const result = transformer(mockBookmarks.withSpecialChars)
    expect(result).toContain('\\[brackets\\]')
    expect(result).toContain('\\*\\*bold\\*\\*')
  })

  it('should escape backslashes first to avoid double-escaping', () => {
    const transformer = createTransformer({})
    const bookmarkWithBackslash = {
      title: 'Path: C:\\Users\\Name',
      url: 'https://example.com',
    } as browser.bookmarks.BookmarkTreeNode

    const result = transformer(bookmarkWithBackslash)
    expect(result).toContain('C:\\\\Users\\\\Name')
  })

  it('should escape HTML characters', () => {
    const transformer = createTransformer({})
    const bookmarkWithHTML = {
      title: '<script>alert("xss")</script>',
      url: 'https://example.com',
    } as browser.bookmarks.BookmarkTreeNode

    const result = transformer(bookmarkWithHTML)
    expect(result).toContain('\\<script\\>')
  })

  it('should format folder with markdown headings (standard format)', () => {
    const transformer = createTransformer({ isObsidianFormat: false })
    const result = transformer(mockBookmarks.folder)
    expect(result).toContain('# My Folder')
    expect(result).toContain('[Link 1](https://site1.com)')
    expect(result).toContain('[Link 2](https://site2.com)')
  })

  it('should format level-2 folders with <details> tags in standard format', () => {
    const transformer = createTransformer({ isObsidianFormat: false })
    const levelTwoFolder = {
      title: 'Collapsible Folder',
      children: [
        {
          title: 'Child Link',
          url: 'https://example.com',
        },
      ],
    } as browser.bookmarks.BookmarkTreeNode

    const result = transformer(levelTwoFolder, 2)
    expect(result).toContain('<details>')
    expect(result).toContain('<summary> Collapsible Folder </summary>')
    expect(result).toContain('</details>')
  })

  it('should handle Obsidian format with escaped titles', () => {
    const transformer = createTransformer({ isObsidianFormat: true })
    const result = transformer(mockBookmarks.folder)
    expect(result).toContain('# My Folder')
    expect(result).toContain('[Link 1](https://site1.com)')
  })

  it('should format level-2 folders with headings in Obsidian format', () => {
    const transformer = createTransformer({ isObsidianFormat: true })
    const levelTwoFolder = {
      title: 'Obsidian Heading Folder',
      children: [{ title: 'Child Link', url: 'https://example.com' }],
    } as browser.bookmarks.BookmarkTreeNode

    const result = transformer(levelTwoFolder, 2)
    expect(result).toContain('### Obsidian Heading Folder')
    expect(result).not.toContain('<details>')
  })

  it('should skip chrome:// URLs', () => {
    const transformer = createTransformer({})
    const chromePage = {
      title: 'Settings',
      url: 'chrome://settings',
    } as browser.bookmarks.BookmarkTreeNode

    expect(transformer(chromePage)).toBe('')
  })

  it('should skip about: URLs', () => {
    const transformer = createTransformer({})
    const aboutPage = {
      title: 'About Blank',
      url: 'about:blank',
    } as browser.bookmarks.BookmarkTreeNode

    expect(transformer(aboutPage)).toBe('')
  })

  it('should add double spacing when isDoubleSpaced is true', () => {
    const transformer = createTransformer({ isDoubleSpaced: true })
    const result = transformer(mockBookmarks.leaf)
    expect(result).toBe('- [Example Site](https://example.com)\n\n')
  })

  it('should add double spacing after folder headings when isDoubleSpaced is true', () => {
    const transformer = createTransformer({ isDoubleSpaced: true })
    const result = transformer(mockBookmarks.folder)
    expect(result).toContain('# My Folder\n\n')
  })

  it('should handle nested folders', () => {
    const transformer = createTransformer({})
    const result = transformer(mockBookmarks.nestedFolder)
    expect(result).toContain('# Root')
    expect(result).toContain('## Subfolder')
    expect(result).toContain('[Deep Link](https://deep.com)')
  })

  it('should not include titles for folders without children', () => {
    const transformer = createTransformer({})
    const emptyFolder = {
      id: '123',
      title: 'Empty Folder',
      children: [],
    } as browser.bookmarks.BookmarkTreeNode

    const result = transformer(emptyFolder)
    expect(result).toBe('')
  })

  it('should ignore bookmarks without title or url', () => {
    const transformer = createTransformer({})
    const incompleteBookmark = {
      title: 'Missing URL',
      // no url
    } as browser.bookmarks.BookmarkTreeNode

    expect(transformer(incompleteBookmark)).toBe('')
  })

  it('should escape all markdown special characters', () => {
    const transformer = createTransformer({})
    const allSpecialChars = {
      title: '\\ < > # * _ [ ] `',
      url: 'https://example.com',
    } as browser.bookmarks.BookmarkTreeNode

    const result = transformer(allSpecialChars)
    expect(result).toContain('\\\\ \\< \\> \\# \\* \\_ \\[ \\] \\`')
  })
})

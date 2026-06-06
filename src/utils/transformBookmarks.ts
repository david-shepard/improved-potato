// worth noting that I saw this in various places but not sure where the source is, see url below 
// https://github.com/search?q=escapemarkdown+language%3AJavaScript&type=code&l=JavaScript
const _escapeMarkdown = (text: string): string =>
  text
    .replace(/\\/g, '\\\\')  // backslash first, so we don't double-escape
    .replace(/</g, '\\<')    // html tags: Obsidian doesn't like angle brackets 
    .replace(/>/g, '\\>')
    .replace(/#/g, '\\#')    // obsidian tags: #tag
    .replace(/\*/g, '\\*')   // bold/italic: **text** or *text*
    .replace(/_/g, '\\_')    // bold/italic: __text__ or _text_
    .replace(/\[/g, '\\[')   // links: [text](url)
    .replace(/\]/g, '\\]')
    .replace(/`/g, '\\`')    // inline code: `code`
export const createTransformer = (options: { isObsidianFormat?: boolean; isDoubleSpaced?: boolean }) => {
  
  const { isObsidianFormat = false, isDoubleSpaced = false } = options

  const transformToMarkdown = (
    bookmark: browser.bookmarks.BookmarkTreeNode,
    level = 0
  ): string => {
    let result = ``
    if (!bookmark.children) {
      if (
        bookmark.title &&
        bookmark.url &&
        !bookmark.url.startsWith('chrome://') &&
        !bookmark.url.startsWith('about:')
      ) {
        const title = _escapeMarkdown(bookmark.title)
        result += `- [${title}](${bookmark.url})\n`
        if (isDoubleSpaced) result += `\n`
      }
    } else {
      if (bookmark.children.length > 0) {
        const headingLevel = Array(level > 5 ? 6 : level + 1)
          .fill('#')
          .join('')
        if (bookmark.title) {
          // TODO: this gets messy, might want to refactor with helper functions 
          if (level === 2)
            result += isObsidianFormat
              ? `${headingLevel} ${_escapeMarkdown(bookmark.title)}`
              : `<details>\n<summary> ${bookmark.title} </summary>`
          else {
            result += isObsidianFormat ? `${headingLevel} ${_escapeMarkdown(bookmark.title)}` : `${headingLevel} ${bookmark.title}`
          }
          result += `${isDoubleSpaced ? `\n\n` : `\n`}`
        }
        result += bookmark.children
          .map((item) => transformToMarkdown(item, level + 1))
          .join('')
        if (bookmark.title && level === 2 && !isObsidianFormat) result += `</details>`
      }
    }
    return result
  }
  
  return transformToMarkdown
}


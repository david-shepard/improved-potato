import { CopyIcon } from '@radix-ui/react-icons'
import React, { useState } from 'react'
import { transformToMarkdown } from '../../utils/transformBookmarks'
import { loadSettings } from '../../utils/settings'

const App = (): JSX.Element => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    const bookmarks = await browser.bookmarks.getTree()
    // TODO: probably want to rename isObsidianFormat to isRawMarkdown unless I add obsidian specific functionality later (ie. inject it into default vault)
    const { isObsidianFormat, isDoubleSpaced } = await loadSettings()
    // TODO: add error handling here, maybe with a try/catch and some user feedback if it fails
    const md = bookmarks.map((b: browser.bookmarks.BookmarkTreeNode) => transformToMarkdown(b, 0, isObsidianFormat, isDoubleSpaced)).join('')
    await navigator.clipboard.writeText(md)

    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 5000)
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center text-center py-12 space-y-4 bg-gray-800 text-white"
      style={{ minWidth: 400 }}>
      <h1 className="text-2xl font-medium">Export to markdown</h1>


      <button
        className="px-3 py-1 flex items-center text-base text-white bg-blue-600 not-disabled:hover:bg-blue-700 not-disabled:hover:shadow-lg transition rounded-md focus:ring focus:outline-none disabled:opacity-70"
        onClick={handleCopy}
        disabled={isCopied}>
        {isCopied ? (
          <>
            <span>Copied to clipboard!</span>
          </>
        ) : (
          <>
            <CopyIcon className="text-white h-4 w-4 mr-2" />
            <span>Copy to clipboard</span>
          </>
        )}
      </button>
    </div>
  )
}

export default App

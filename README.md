# Improved Potato

A Chrome extension that exports your bookmarks to Markdown with a single click.

## What it does

Click the extension icon, hit **Copy to clipboard**, and your entire bookmark tree is converted to Markdown and ready to paste. Optionally format output for [Obsidian](https://obsidian.md/).

## Installation

### From source

```sh
git clone https://github.com/david-shepard/improved-potato.git
cd improved-potato
npm install --ignore-scripts && npm rebuild esbuild
```

Load the extension in Chrome:

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `dist` folder

### Development

```sh
npm start
```

The extension reloads automatically when you save changes in `src/`.

### Production build

```sh
npm run release
```

Outputs a `dist/build.zip` ready for upload to the Chrome Web Store.

## Options

Open the extension's options page to configure:

- **Format for Obsidian** — escapes special Markdown characters so links and headings render correctly in Obsidian
- **Double spacing** — adds a blank line after each bookmark entry

## Output format

Bookmark folders become Markdown headings. Individual bookmarks become list items with their title linked to their URL. Top-level folders (depth 2) are wrapped in `<details>` / `<summary>` (this is customizable, see [options](./src/pages/options/App.tsx)) tags in standard mode for collapsible sections.

```markdown
## Work
<details>
<summary> Tools </summary>

- [GitHub](https://github.com)
- [Linear](https://linear.app)

</details>
```

## Features

- Uses twind for styling
- Uses Rollup to bundle your extension
- Chrome Extension automatic reloader

## Resources

[Chrome Extension official documentation](https://developer.chrome.com/docs/webstore/)

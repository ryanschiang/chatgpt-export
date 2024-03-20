# Export OpenAI ChatGPT Conversations (chatgpt-export)

[![GitHub license](https://img.shields.io/github/license/ryanschiang/chatgpt-export)](
    ./LICENSE
)
[![Github Stars](https://img.shields.io/github/stars/ryanschiang/chatgpt-export?style=social)](
    https://github.com/ryanschiang/chatgpt-export/stargazers
)

This browser script formats and downloads ChatGPT conversations to markdown, JSON, and PNG for sharing and exporting chat logs.

You can export the active ChatGPT chat log directly from the browser console, entirely locally. No data is sent to any server.

**Supports the latest ChatGPT web UI as of March 20, 2024.**

## Usage

 1. Navigate to [chat.openai.com/chat](https://chat.openai.com/chat).
 2. Open the chat thread you'd like to export.
 3. Open the browser console (how to open console: [Chrome](https://developer.chrome.com/docs/devtools/open), [Firefox](https://firefox-source-docs.mozilla.org/devtools-user/), [Safari](https://developer.apple.com/library/archive/documentation/NetworkingInternetWeb/Conceptual/Web_Inspector_Tutorial/EnableWebInspector/EnableWebInspector.html))
 4. Follow the below steps depending on which output type you'd like.

 > [!IMPORTANT]  
> Always be careful when pasting code into the console. Only paste code from trusted sources, as it can be used to execute malicious code.
> You can explore this repository and verify the code before pasting it into the console, or clone and build the code yourself.

### JSON

1. Copy contents of [`/dist/json.min.js`](./dist/json.min.js)
2. Paste into browser console

### Markdown

1. Copy contents of [`/dist/md.min.js`](./dist/md.min.js)
2. Paste into browser console

### Image (.PNG)

1. Copy contents of [`/dist/image.min.js`](./dist/image.min.js)
2. Paste into browser console

> [!NOTE]  
> Downloading as an image uses the `html2canvas` library to take a screenshot of the chat log. This may take a few seconds to process.

#### Example output:
![alt text](./public/chatgpt-export-example.png "chatgpt-export Example Output")

## Limitations

This is a trivial implementation as ChatGPT currently does not support sharing or exporting conversations. It may break with future changes.

It currently supports:
- Paragraphs / Text
- Lists
- Code blocks
- Tables

## Acknowledgements

- [html2canvas](https://github.com/niklasvh/html2canvas) - Used to take a screenshot of the chat log and export as a PNG.

## You May Also Like

[`claude-export`](https://github.com/ryanschiang/claude-export) - Export Anthropic Claude conversations to markdown, JSON, and PNG for sharing and exporting chat logs.

## Future Development

- [ ] Nested code blocks (within lists)
- [ ] Trim whitespace on exported images
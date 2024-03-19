# Export OpenAI ChatGPT Conversations (chatgpt-export)

[![GitHub license](https://img.shields.io/github/license/ryanschiang/claude-export)](
    ./LICENSE
)

Format and download ChatGPT conversations to markdown, JSON, and PNG for sharing and exporting chat logs.

Exports the active ChatGPT chat log directly from the browser console.

## Usage

 1. Navigate to [chat.openai.com/chat](https://chat.openai.com/chat).
 2. Open the chat thread you'd like to export.
 3. Open the browser console (how to open console: [Chrome](https://developer.chrome.com/docs/devtools/open), [Firefox](https://firefox-source-docs.mozilla.org/devtools-user/), [Safari](https://developer.apple.com/library/archive/documentation/NetworkingInternetWeb/Conceptual/Web_Inspector_Tutorial/EnableWebInspector/EnableWebInspector.html))
 4. Follow the below steps depending on which output type you'd like.

 > [!IMPORTANT]  
> Always be careful when pasting code into the console. Only paste code from trusted sources, as it can be used to execute malicious code.
> You can explore this repository and verify the code before pasting it into the console, or clone and build the code yourself.

### JSON

1. Open browser console
2. Copy and paste this function:

`fetch('https://raw.githubusercontent.com/ryanschiang/chatgpt-export/main/dist/json.min.js').then(response => response.text()).then(text => eval(text))`

OR:

1. Copy contents of `/dist/json.min.js`
2. Paste into browser console

### Markdown

1. Open browser console
2. Copy and paste this function:

`fetch('https://raw.githubusercontent.com/ryanschiang/chatgpt-export/main/dist/md.min.js').then(response => response.text()).then(text => eval(text))`

OR:

1. Copy contents of `/dist/md.min.js`
2. Paste into browser console

### Image (.PNG)

1. Open browser console
2. Copy and paste this function:

`fetch('https://raw.githubusercontent.com/ryanschiang/chatgpt-export/main/dist/image.min.js').then(response => response.text()).then(text => eval(text))`

OR:

1. Copy contents of `/dist/image.min.js`
2. Paste into browser console

#### Example output:
![alt text](./public/chatgpt-export-example.png "chatgpt-export Example Output")

## Limitations

This is a trivial implementation as ChatGPT currently does not support sharing or exporting conversations. It may break with future changes.

It currently supports:
- Paragraphs / Text
- Lists
- Code blocks
- Tables

## You May Also Like

[`claude-export`](https://github.com/ryanschiang/claude-export) - Export Anthropic Claude conversations to markdown, JSON, and PNG for sharing and exporting chat logs.

## Future Development

- [ ] Nested code blocks (within lists)
- [ ] Trim whitespace on exported images
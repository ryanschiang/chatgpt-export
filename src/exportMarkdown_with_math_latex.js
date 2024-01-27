const consoleSave = require("./util/consoleSave");
const getTimestamp = require("./util/getTimestamp");

(function exportMarkdown() {
  var markdown = "";
  var elements = document.querySelectorAll("[class*='min-h-[20px]']");
  var timestamp = getTimestamp();
  markdown += `\`${timestamp}\`\n\n`;

  function processNode(node) {
    let nodeMarkdown = "";
    var text = node.textContent;
    if (node.nodeType === Node.TEXT_NODE) {
      // Directly add the text content from text nodes
      // console.log(`Tag: ${tag}`);
      // console.log(node);
      // console.log(`Text: ${text}`);

      nodeMarkdown += node.textContent;
      return nodeMarkdown;
    }

    if (node.classList.contains("math")) {
      isinLine = node.classList.contains("math-inline");
      var katexMathMLNode = node.querySelector(".katex-mathml");
      if (katexMathMLNode) {
        var annotationNode = katexMathMLNode.querySelector("annotation");
        if (annotationNode) {
          if (isinLine) {
            nodeMarkdown += `$${annotationNode.textContent.trim()}$`;
          } else {
            nodeMarkdown += `$$\n${annotationNode.textContent.trim()}\n$$\n\n`;
          }
        }
      }
      return nodeMarkdown;
    }

    switch (node.nodeType) {
      case Node.TEXT_NODE:
        nodeMarkdown += node.textContent;
        // console.log(`Tag: ${tag}`);
        // console.log(node);
        // console.log(`Text: ${text}`);
        break;
      case Node.ELEMENT_NODE:
        var tag = node.tagName;
        var text = node.textContent;

        switch (tag) {
          case "P":
            node.childNodes.forEach(child => {
              nodeMarkdown += processNode(child);
            });
            nodeMarkdown += `\n\n`;
            break;
          case "OL":
            node.childNodes.forEach((listItemNode, index) => {
              if (listItemNode.nodeType === Node.ELEMENT_NODE && listItemNode.tagName === "LI") {
                nodeMarkdown += `${index + 1}. ${processNode(listItemNode)}\n`;
              }
            });
            nodeMarkdown += "\n";
            break;
          case "UL":
            node.childNodes.forEach((listItemNode) => {
              if (listItemNode.nodeType === Node.ELEMENT_NODE && listItemNode.tagName === "LI") {
                nodeMarkdown += `- ${processNode(listItemNode)}\n`;
              }
            });
            nodeMarkdown += "\n";
            break;
          case "PRE":
            const codeBlockSplit = text.split("Copy code");
            const codeBlockLang = codeBlockSplit[0].trim();
            const codeBlockData = codeBlockSplit[1].trim();
            // console.log(`Tag: ${tag}`);
            // console.log(node);
            // console.log(`Text: ${text}`);
            nodeMarkdown += `\`\`\`${codeBlockLang}\n${codeBlockData}\n\`\`\`\n\n`;
            break;
          case "TABLE":
            // console.log(`Tag: ${tag}`);
            // console.log(node);
            // console.log(`Text: ${text}`);
            node.childNodes.forEach((tableSectionNode) => {
              if (tableSectionNode.nodeType === Node.ELEMENT_NODE &&
                  (tableSectionNode.tagName === "THEAD" || tableSectionNode.tagName === "TBODY")) {
                let tableRows = "";
                let tableColCount = 0;
                tableSectionNode.childNodes.forEach((tableRowNode) => {
                  if (tableRowNode.nodeType === Node.ELEMENT_NODE && tableRowNode.tagName === "TR") {
                    let tableCells = "";
                    tableRowNode.childNodes.forEach((tableCellNode) => {
                      if (tableCellNode.nodeType === Node.ELEMENT_NODE &&
                          (tableCellNode.tagName === "TD" || tableCellNode.tagName === "TH")) {
                        tableCells += `| ${tableCellNode.textContent} `;
                        if (tableSectionNode.tagName === "THEAD") {
                          tableColCount++;
                        }
                      }
                    });
                    tableRows += `${tableCells}|\n`;
                  }
                });
                nodeMarkdown += tableRows;
                if (tableSectionNode.tagName === "THEAD") {
                  const headerRowDivider = `| ${Array(tableColCount).fill("---").join(" | ")} |\n`;
                  nodeMarkdown += headerRowDivider;
                }
              }
            });
            nodeMarkdown += "\n";
            break;
          default:
            node.childNodes.forEach(child => {
              nodeMarkdown += processNode(child);
            });
            break;
        }
        break;
    }

    return nodeMarkdown;
  }

  for (var i = 0; i < elements.length; i++) {
    var ele = elements[i];
    // console.log(ele)
    // var firstChild = ele.firstChild;
    // if (!firstChild) continue;
    if (ele.nodeType === Node.ELEMENT_NODE && ele.getAttribute("data-message-author-role") === "user") {
      markdown += `<br>_ChatGPT_:<br>\n`;
    } else if (ele.nodeType === Node.ELEMENT_NODE && ele.getAttribute("data-message-author-role") === "assistant") {
      markdown += `<br>_Prompt_:<br> \n`;
    }
    markdown += processNode(ele) + "\n";
  }

  consoleSave(console, "md");
  console.save(markdown);
  return markdown;
})();

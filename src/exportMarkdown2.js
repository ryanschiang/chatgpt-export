const consoleSave = require("./util/consoleSave");
const getTimestamp = require("./util/getTimestamp");

(function exportMarkdown() {
  var markdown = "";
  var elements = document.querySelectorAll("[class*='min-h-[20px]']");
  var timestamp = getTimestamp();
  markdown += `\`${timestamp}\`\n\n`;







  function processNode(node) {
    let nodeMarkdown = "";

    if (node.nodeType === Node.TEXT_NODE) {
        // Directly add the text content from text nodes
        console.log(`Tag: ${tag}`);
        console.log(node);
        console.log(`Text: ${text}`);

        nodeMarkdown += node.textContent;
        return nodeMarkdown;
      }


    switch (node.nodeType) {
      case Node.TEXT_NODE:
        nodeMarkdown += node.textContent;
        console.log(`Tag: ${tag}`);
        console.log(node);
        console.log(`Text: ${text}`);

        break;
      case Node.ELEMENT_NODE:
        var tag = node.tagName;
        var text = node.textContent;



        switch (tag) {
          case "P":
            nodeMarkdown += `${text}\n\n`;
            console.log(`Tag: ${tag}`);
            console.log(node);
            console.log(`Text: ${text}`);
    
            break;
          case "OL":
            node.childNodes.forEach((listItemNode, index) => {
              if (listItemNode.nodeType === Node.ELEMENT_NODE && listItemNode.tagName === "LI") {
                nodeMarkdown += `${index + 1}. ${listItemNode.textContent}\n`;
              }
            });
            nodeMarkdown += "\n";

            console.log(`Tag: ${tag}`);
            console.log(node);
            console.log(`Text: ${text}`);
    

            break;
          case "UL":
            node.childNodes.forEach((listItemNode) => {
              if (listItemNode.nodeType === Node.ELEMENT_NODE && listItemNode.tagName === "LI") {
                nodeMarkdown += `- ${listItemNode.textContent}\n`;
              }
            });

            console.log(`Tag: ${tag}`);
            console.log(node);
            console.log(`Text: ${text}`);
    

            nodeMarkdown += "\n";
            break;
          case "PRE":
            const codeBlockSplit = text.split("Copy code");
            const codeBlockLang = codeBlockSplit[0].trim();
            const codeBlockData = codeBlockSplit[1].trim();

            console.log(`Tag: ${tag}`);
            console.log(node);
            console.log(`Text: ${text}`);
    

            nodeMarkdown += `\`\`\`${codeBlockLang}\n${codeBlockData}\n\`\`\`\n\n`;
            break;
          case "TABLE":

          console.log(`Tag: ${tag}`);
          console.log(node);
          console.log(`Text: ${text}`);
  
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
          case "MATH":
            console.log(`Tag: ${tag}`);
            console.log(node);
            console.log(`Text: ${text}`);
    

            nodeMarkdown += `$$\n${node.textContent}\n$$\n\n`;
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
    var firstChild = ele.firstChild;
    if (!firstChild) continue;

    if (firstChild.nodeType === Node.ELEMENT_NODE && firstChild.className.includes("request-")) {
      markdown += `_ChatGPT_:\n`;
    } else if (firstChild.nodeType === Node.TEXT_NODE) {
      markdown += `_Prompt_: \n`;
    }

    markdown += processNode(ele) + "\n";
  }

  consoleSave(console, "md");
  console.save(markdown);
  return markdown;
})();

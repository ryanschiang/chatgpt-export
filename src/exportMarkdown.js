const consoleSave = require("./util/consoleSave");
const getTimestamp = require("./util/getTimestamp");

(function exportMarkdown() {
  var markdown = "";
  var elements = document.querySelectorAll("[class*='min-h-[20px]']");
  var timestamp = getTimestamp();
  markdown += `\`${timestamp}\`\n\n`;

  for (var i = 0; i < elements.length; i++) {
    var ele = elements[i];

    // Get first child
    var firstChild = ele.firstChild;
    if (!firstChild) continue;

    // Element child
    if (firstChild.nodeType === Node.ELEMENT_NODE) {
      var childNodes = firstChild.childNodes;

      // Prefix ChatGPT reponse label
      if (firstChild.className.includes("request-")) {
        markdown += `_ChatGPT_:\n`;
      }

      // Parse child elements
      for (var n = 0; n < childNodes.length; n++) {
        const childNode = childNodes[n];

        if (childNode.nodeType === Node.ELEMENT_NODE) {
          var tag = childNode.tagName;
          var text = childNode.textContent;
          // Paragraphs
          if (tag === "P") {
            markdown += `${text}\n`;
          }

          // Get list items
          if (tag === "OL") {
            childNode.childNodes.forEach((listItemNode, index) => {
              if (
                listItemNode.nodeType === Node.ELEMENT_NODE &&
                listItemNode.tagName === "LI"
              ) {
                markdown += `${index + 1}. ${
                  listItemNode.textContent
                }\n`;
              }
            });
          }
          if (tag === "UL") {
            childNode.childNodes.forEach((listItemNode, index) => {
              if (
                listItemNode.nodeType === Node.ELEMENT_NODE &&
                listItemNode.tagName === "LI"
              ) {
                markdown += `- ${listItemNode.textContent}\n`;
              }
            });
          }

          // Code blocks
          if (tag === "PRE") {
            const codeBlockSplit = text.split("Copy code");
            const codeBlockLang = codeBlockSplit[0].trim();
            const codeBlockData = codeBlockSplit[1].trim();

            markdown += `\`\`\`${codeBlockLang}\n${codeBlockData}\n\`\`\`\n`;
          }

          // Tables
          if (tag === "TABLE") {
            // Get table sections
            let tableMarkdown = "";
            childNode.childNodes.forEach((tableSectionNode) => {
              if (
                tableSectionNode.nodeType === Node.ELEMENT_NODE &&
                (tableSectionNode.tagName === "THEAD" ||
                  tableSectionNode.tagName === "TBODY")
              ) {
                // Get table rows
                let tableRows = "";
                let tableColCount = 0;
                tableSectionNode.childNodes.forEach(
                  (tableRowNode) => {
                    if (
                      tableRowNode.nodeType === Node.ELEMENT_NODE &&
                      tableRowNode.tagName === "TR"
                    ) {
                      // Get table cells
                      let tableCells = "";

                      tableRowNode.childNodes.forEach(
                        (tableCellNode) => {
                          if (
                            tableCellNode.nodeType ===
                              Node.ELEMENT_NODE &&
                            (tableCellNode.tagName === "TD" ||
                              tableCellNode.tagName === "TH")
                          ) {
                            tableCells += `| ${tableCellNode.textContent} `;
                            if (
                              tableSectionNode.tagName === "THEAD"
                            ) {
                              tableColCount++;
                            }
                          }
                        }
                      );
                      tableRows += `${tableCells}|\n`;
                    }
                  }
                );

                tableMarkdown += tableRows;

                if (tableSectionNode.tagName === "THEAD") {
                  const headerRowDivider = `| ${Array(tableColCount)
                    .fill("---")
                    .join(" | ")} |\n`;
                  tableMarkdown += headerRowDivider;
                }
              }
            });
            markdown += tableMarkdown;
          }

          // Paragraph break after each element
          markdown += "\n";
        }
      }
    }

    // Text child
    if (firstChild.nodeType === Node.TEXT_NODE) {
      // Prefix User prompt label
      markdown += `_Prompt_: \n`;
      markdown += `${firstChild.textContent}\n`;

      // End of prompt paragraphs breaks
      markdown += "\n";
    }
  }

  // Save to file
  consoleSave(markdown, "chatgpt.md");
  console.save(markdown, "chatgpt.md");
  return markdown;
})();

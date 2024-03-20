const consoleSave = require("./util/consoleSave");
const getTimestamp = require("./util/getTimestamp");
const getTitle = require("./util/getTitle");

(function exportJSON() {
    const title = getTitle();

    var json = {
        meta: {
            title: title,
            exportedAt: getTimestamp(),
        },
    };
    var chats = [];

    // Find all chat elements
    var elements = document.querySelectorAll(
        "[class*='min-h-[20px]']"
    );

    for (var i = 0; i < elements.length; i++) {
        var ele = elements[i];

        // Prepare object
        var object = {
            index: i,
        };
        var message = [];

        // Get first child
        var firstChild = ele.firstChild;
        if (!firstChild) continue;

        // Element child
        if (firstChild.nodeType === Node.ELEMENT_NODE) {
            var childNodes = firstChild.childNodes;

            // Prefix ChatGPT reponse label
            if (firstChild.className.includes("markdown")) {
                object.type = "response";
            } else {
                object.type = "prompt";
            }

            console.log("firstChild", firstChild);

            // Parse child elements
            for (var n = 0; n < childNodes.length; n++) {
                const childNode = childNodes[n];
                console.log("childNode", childNode);

                if (childNode.nodeType === Node.ELEMENT_NODE) {
                    var tag = childNode.tagName;
                    var text = childNode.textContent;

                    switch (tag) {
                        case "OL":
                        case "UL":
                            const listItems = [];
                            childNode.childNodes.forEach(
                                (listItemNode, index) => {
                                    if (
                                        listItemNode.nodeType ===
                                            Node.ELEMENT_NODE &&
                                        listItemNode.tagName === "LI"
                                    ) {
                                        listItems.push({
                                            type: "li",
                                            data: listItemNode.textContent,
                                        });
                                    }
                                }
                            );

                            if (tag === "OL") {
                                message.push({
                                    type: "ol",
                                    data: listItems,
                                });
                            }
                            if (tag === "UL") {
                                message.push({
                                    type: "ul",
                                    data: listItems,
                                });
                            }
                            break;
                        case "PRE":
                            const codeBlockSplit =
                                text.split("Copy code");
                            const codeBlockLang =
                                codeBlockSplit[0].trim();
                            const codeBlockData =
                                codeBlockSplit[1].trim();

                            message.push({
                                type: "pre",
                                language: codeBlockLang,
                                data: codeBlockData,
                            });
                            break;
                        case "TABLE":
                            const tableSections = [];

                            // Get table sections
                            childNode.childNodes.forEach(
                                (tableSectionNode) => {
                                    if (
                                        tableSectionNode.nodeType ===
                                            Node.ELEMENT_NODE &&
                                        (tableSectionNode.tagName ===
                                            "THEAD" ||
                                            tableSectionNode.tagName ===
                                                "TBODY")
                                    ) {
                                        // Get table rows
                                        const tableRows = [];
                                        tableSectionNode.childNodes.forEach(
                                            (tableRowNode) => {
                                                if (
                                                    tableRowNode.nodeType ===
                                                        Node.ELEMENT_NODE &&
                                                    tableRowNode.tagName ===
                                                        "TR"
                                                ) {
                                                    // Get table cells
                                                    const tableCells =
                                                        [];
                                                    tableRowNode.childNodes.forEach(
                                                        (
                                                            tableCellNode
                                                        ) => {
                                                            if (
                                                                tableCellNode.nodeType ===
                                                                    Node.ELEMENT_NODE &&
                                                                (tableCellNode.tagName ===
                                                                    "TD" ||
                                                                    tableCellNode.tagName ===
                                                                        "TH")
                                                            ) {
                                                                tableCells.push(
                                                                    {
                                                                        type: tableCellNode.tagName.toLowerCase(),
                                                                        data: tableCellNode.textContent,
                                                                    }
                                                                );
                                                            }
                                                        }
                                                    );
                                                    tableRows.push({
                                                        type: "tr",
                                                        data: tableCells,
                                                    });
                                                }
                                            }
                                        );

                                        tableSections.push({
                                            type: tableSectionNode.tagName.toLowerCase(),
                                            data: tableRows,
                                        });
                                    }
                                }
                            );

                            message.push({
                                type: "table",
                                data: tableSections,
                            });
                            break;
                        
                        case "H1":
                          message.push({
                            type: "h1",
                            data: text,
                          });
                          break;
                        case "H2":
                          message.push({
                            type: "h2",
                            data: text,
                          });
                          break;
                        case "H3":
                          message.push({
                            type: "h3",
                            data: text,
                          });
                          break;
                        case "H4":
                          message.push({
                            type: "h4",
                            data: text,
                          });
                          break;
                        case "H5":
                          message.push({
                            type: "h5",
                            data: text,
                          });
                          break;
                        case "H6":
                          message.push({
                            type: "h6",
                            data: text,
                          });
                          break;
                        case "P":
                        default:
                            message.push({
                                type: "p",
                                data: text,
                            });
                            break;
                    }
                } else if (childNode.nodeType === Node.TEXT_NODE) {
                    var text = childNode.textContent;

                    message.push({
                        type: "p",
                        data: text,
                    });
                }
            }
        }

        // Text child
        if (firstChild.nodeType === Node.TEXT_NODE) {
            // Prefix User prompt label
            object.type = "prompt";
            message.push(firstChild.textContent);
        }

        // Add message data to chats
        object.message = message;
        chats.push(object);
    }

    // Add chats to JSON output
    json.chats = chats;

    // Save to file
    consoleSave(console, "json");
    console.save(json);
    return json;
})();

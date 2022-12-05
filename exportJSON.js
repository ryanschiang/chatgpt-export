(function exportJSON() {
    var json = {
        meta: {
            timestamp: new Date(
                new Date(new Date(new Date()).toISOString()).getTime() - new Date().getTimezoneOffset() * 60000
              )
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
        }
    }
  var chats = [];
  var elements = document.querySelectorAll("[class*='min-h-[20px]']");

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
      if (firstChild.className.includes("request-")) {
        object.type = "response"
      }

      // Parse child elements
      for (var n = 0; n < childNodes.length; n++) {
        const childNode = childNodes[n];

        if (childNode.nodeType === Node.ELEMENT_NODE) {
          var tag = childNode.tagName;
          var text = childNode.textContent;
          // Paragraphs
          if (tag === "P") {
            message.push({
                type: "p",
                data: text,
            });
          }

          // Get list items
          if (tag === "OL" || tag === "UL") {

              listItems = []
              childNode.childNodes.forEach((listItemNode, index) => {
                if (
                  listItemNode.nodeType === Node.ELEMENT_NODE &&
                  listItemNode.tagName === "LI"
                ) {
                  listItems.push({
                      type: "li",
                      data: listItemNode.textContent
                  })
                }
              });

              if (tag === "OL") {
                message.push({
                    type: "ol",
                    data: listItems,
                })
              }
              if (tag === "UL") {
                message.push({
                    type: "ul",
                    data: listItems
                })
              }
          }


          // Code blocks
          if (tag === "PRE") {
            message.push({
                type: "pre",
                data: text,
            })
          }
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
  (function (console) {
    console.save = function (data, filename) {
      if (!filename) filename = "chatgpt.json";

      if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4);
      }

      var blob = new Blob([data], { type: "text/json" });
      var a = document.createElement("a");

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(
        ":"
      );
      var e = new MouseEvent("click", {
        canBubble: true,
        cancelable: false,
        view: window,
        detail: 0,
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: null,
      });

      a.dispatchEvent(e);
    };
  })(console);

  console.save(json, "chatgpt.json");
  return json;
})();

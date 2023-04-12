const getTimestamp = require("./util/getTimestamp");

(function exportImage() {
  // download img
  function triggerDownload(imgURI) {
    var evt = new MouseEvent("click", {
      view: window,
      bubbles: false,
      cancelable: true,
    });

    const title = document.getElementsByTagName("title")[0].innerText;
    let filename = title ? title.trim().toLowerCase().replace(/^[^\w\d]+|[^\w\d]+$/g, '').replace(/[\s\W-]+/g, '-') : "chatgpt";
    var a = document.createElement("a");
    a.setAttribute("download", filename + ".png");
    a.setAttribute("href", imgURI);
    a.setAttribute("target", "_blank");

    a.dispatchEvent(evt);
  }

  // canvas config
  var canvasWidth = 1200;

  // prepare image elements
  var imageContent = "";
  var promptBg = "#272832";
  var footerBg = "#1b1c22";
  var responseBg = "#343642";
  var promptStartDiv = `<div style="background: ${promptBg}; padding: 16px; ">`;
  var responseStartDiv = `<div style="background: ${responseBg}; padding: 16px; ">`;

  function divWrapper(child) {
    return `<div style="line-height: 1.5em; margin-bottom: 0.85em">${child}</div>`;
  }

  // extract chats
  var elements = document.querySelectorAll("[class*='min-h-[20px]']");
  for (var i = 0; i < elements.length; i++) {
    var ele = elements[i];

    // Get first child
    var firstChild = ele.firstChild;
    if (!firstChild) continue;

    // Element child
    if (firstChild.nodeType === Node.ELEMENT_NODE) {
      var isResponse = firstChild.className.includes("request-");
      var childNodes = firstChild.childNodes;

      // Prefix ChatGPT reponse label
      if (isResponse) {
        imageContent += responseStartDiv;
        imageContent += divWrapper("<em>ChatGPT:</em>");
      } else {
        imageContent += promptStartDiv;
      }

      // Parse child elements
      for (var n = 0; n < childNodes.length; n++) {
        const childNode = childNodes[n];

        if (childNode.nodeType === Node.ELEMENT_NODE) {
          var tag = childNode.tagName;
          var text = childNode.textContent;
          // Paragraphs
          if (tag === "P") {
            imageContent += divWrapper(text);
          }

          // Get list items
          if (tag === "OL" || tag === "UL") {
            listItems = "";
            childNode.childNodes.forEach((listItemNode) => {
              if (
                listItemNode.nodeType === Node.ELEMENT_NODE &&
                listItemNode.tagName === "LI"
              ) {
                listItems += `<li>${listItemNode.textContent}</li>`;
              }
            });

            if (tag === "OL") {
              imageContent += divWrapper(`<ol>${listItems}</ol>`);
            }
            if (tag === "UL") {
              imageContent += divWrapper(`<ul>${listItems}</ul>`);
            }
          }

          // Code blocks
          if (tag === "PRE") {
            var codeText = "";
            try {
              // get spans for syntax highlighting
              var divChild = childNode.children[0];
              var codeDivChild = divChild.children[1];
              var codeBlock = codeDivChild.children[0];

              codeBlock.childNodes.forEach((node) => {
                var nodeText = node.textContent;
                switch (node.nodeType) {
                  case Node.ELEMENT_NODE:
                    var spanColor = "#ffffff";
                    if (node.tagName === "SPAN") {
                      var nodeClass = node.className;
                      if (nodeClass.includes("-keyword")) {
                        spanColor = "#267FC5";
                      }
                      if (nodeClass.includes("-title")) {
                        spanColor = "#DC122C";
                      }
                      if (nodeClass.includes("-string")) {
                        spanColor = "#148B61";
                      }
                      if (nodeClass.includes("-comment")) {
                        spanColor = "#6D6D6D";
                      }
                      if (nodeClass.includes("-number")) {
                        spanColor = "#D41366";
                      }
                    }
                    codeText += `<span style="color: ${spanColor};">${nodeText}</span>`;
                    break;
                  case Node.TEXT_NODE:
                  default:
                    codeText += nodeText;
                    break;
                }
              });
            } catch (err) {
              codeText = text.replace("Copy code", "");
            }
            imageContent += divWrapper(
              `<pre style="background: #000; padding:16px; white-space: pre-wrap;">${codeText}</pre>`
            );
          }

          if (tag === "TABLE") {
            // Get table sections
            let tableContent = "";
            childNode.childNodes.forEach((tableSectionNode) => {
              if (
                tableSectionNode.nodeType === Node.ELEMENT_NODE &&
                (tableSectionNode.tagName === "THEAD" ||
                  tableSectionNode.tagName === "TBODY")
              ) {
                // Get table rows
                let tableRows = "";

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
                            tableCells += `<td>${tableCellNode.textContent}</td>`;
                          }
                        }
                      );

                      tableRows += `<tr>${tableCells}</tr>`;
                    }
                  }
                );

                const sectionTag = tableSectionNode.tagName.toLowerCase();
                tableContent += `<${sectionTag}>${tableRows}</${sectionTag}>`;
              }
            });

            imageContent += divWrapper(`<table>${tableContent}</table>`);
          }
        }
      }
    }

    // Text child
    if (firstChild.nodeType === Node.TEXT_NODE) {
      // Prefix User prompt label
      imageContent += promptStartDiv;
      imageContent += divWrapper("<em>Prompt:</em>");
      var text = firstChild.textContent;
      imageContent += divWrapper(text);
    }

    // close div
    imageContent += `</div>`;
  }

  //Edge Blob polyfill https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
      value: function (callback, type, quality) {
        var canvas = this;
        setTimeout(function () {
          var binStr = atob(
              canvas.toDataURL(type, quality).split(",")[1]
            ),
            len = binStr.length,
            arr = new Uint8Array(len);

          for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }

          callback(new Blob([arr], { type: type || "image/png" }));
        });
      },
    });
  }

  // create canvas
  var canvas = document.createElement("canvas");

  // create content
  var content = imageContent;

  // get size of contents
  var sizingDiv = document.createElement("div");
  sizingDiv.id = "sizing-div";
  sizingDiv.style.width = canvasWidth / 2 + "px";
  sizingDiv.innerHTML = content.trim();
  document.body.appendChild(sizingDiv);
  var sizingDivHeight = sizingDiv.offsetHeight * 2;

  // remove sizing div
  sizingDiv.remove();

  // compile
  var timestamp = getTimestamp();

  var xmlDiv = document.createElement("div");
  xmlDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  xmlDiv.style.width = canvasWidth / 2 + "px";
  xmlDiv.style.fontFamily = "sans-serif";
  xmlDiv.style.fontSize = "14px";

  var headerDiv = document.createElement("div");
  headerDiv.innerText = timestamp;
  headerDiv.style.fontSize = "12px";
  headerDiv.style.paddingTop = "4px";
  headerDiv.style.paddingBottom = "2px";
  headerDiv.style.fontFamily = "monospace";
  headerDiv.style.textAlign = "center";
  headerDiv.style.color = "rgba(255,255,255,0.25)";
  headerDiv.style.background = footerBg;

  var contentDiv = document.createElement("div");
  contentDiv.style.color = "#fff";
  contentDiv.style.fontWeight = 300;
  contentDiv.style.marginRight = "auto";
  contentDiv.style.marginLeft = "auto";
  contentDiv.appendChild(sizingDiv);

  var footerDiv = document.createElement("div");
  footerDiv.innerText = "Generated with chatgpt-export";
  footerDiv.style.fontSize = "12px";
  footerDiv.style.paddingTop = "2px";
  footerDiv.style.paddingBottom = "4px";
  footerDiv.style.fontFamily = "monospace";
  footerDiv.style.textAlign = "center";
  footerDiv.style.color = "rgba(255,255,255,0.25)";
  footerDiv.style.background = footerBg;

  xmlDiv.appendChild(headerDiv);
  xmlDiv.appendChild(contentDiv);
  xmlDiv.appendChild(footerDiv);

  var data = `<svg id="svg" xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}px" height="${sizingDivHeight}px">
  <foreignObject width="100%" height="100%">
  ${xmlDiv.outerHTML}
  </foreignObject>
  </svg>
  `;

  // canvas styles
  canvas.width = canvasWidth;
  canvas.height = sizingDivHeight;

  //get DPI
  let dpi = window.devicePixelRatio;

  // get context
  var ctx = canvas.getContext("2d");
  ctx.scale(dpi, dpi);

  // create image
  data = encodeURIComponent(data);
  var img = new Image();
  img.src = "data:image/svg+xml," + data;
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function (blob) {
      var newImg = document.createElement("img"),
        url = URL.createObjectURL(blob);

      newImg.onload = function () {
        // no longer need to read the blob so it's revoked
        URL.revokeObjectURL(url);
      };

      newImg.src = url;
      document.body.appendChild(newImg);

      // download image
      var imgURI = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      triggerDownload(imgURI);

      // remove image element
      newImg.remove();
    });
  };
})();

(function exportImage() {
  // download img
  function triggerDownload(imgURI) {
    var evt = new MouseEvent("click", {
      view: window,
      bubbles: false,
      cancelable: true,
    });

    var a = document.createElement("a");
    a.setAttribute("download", "chatgpt.png");
    a.setAttribute("href", imgURI);
    a.setAttribute("target", "_blank");

    a.dispatchEvent(evt);
  }

  // canvas config
  var canvasWidth = 1200;
  var canvasHeight = 1600;
  var canvasPadding = 0;

  // prepare image elements
  var imageContent = "";
  var promptBg = "#272832";
  var footerBg = "#1b1c22";
  var responseBg = "#343642";
  var promptStartDiv = `<div style="background: ${promptBg}; padding: 16px; ">`;
  var responseStartDiv = `<div style="background: ${responseBg}; padding: 16px; ">`;

  function divWrapper(child) {
    return `<div style="line-height: 1.5em; margin-bottom: 0.75em">${child}</div>`;
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
            childNode.childNodes.forEach((listItemNode, index) => {
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
  var contentWidth = (canvasWidth - canvasPadding * 2) / 2;

  // create content
  var content = imageContent;

  // get size of contents
  var sizingDiv = document.createElement("div");
  sizingDiv.id = "sizing-div";
  sizingDiv.style.width = canvasWidth / 2 + "px";
  sizingDiv.innerHTML = content.trim();
  document.body.append(sizingDiv);
  var sizingDivHeight = sizingDiv.offsetHeight * 2;

  // remove sizing div
  sizingDiv.remove();

  // compile
  var timestamp = new Date(
    new Date(new Date(new Date()).toISOString()).getTime() -
      new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  var divChild = `<div xmlns="http://www.w3.org/1999/xhtml" style="width: ${
    canvasWidth / 2
  }px; position: relative; font-family: sans-serif; font-smooth: none; font-size:14px">
  <div style="background: ${footerBg}; font-size: 12px; font-family: monospace; padding-top:4px; padding-bottom:2px; text-align: center; color: rgba(255, 255, 255, 0.25)">
  ${timestamp}
  </div>
  <div style="color: #fff; font-weight: 300; width: ${contentWidth}px; margin-right: auto; margin-left:auto; display: block;">
  ${content}
  </div>
  <div style="background: ${footerBg}; font-size: 12px; font-family: monospace; padding-top:2px; padding-bottom:2px; text-align: center; color: rgba(255, 255, 255, 0.25)">
  Generated with chatgpt-export
  </div>
</div>
  `;

  var data = `<svg id="svg" xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}px" height="${sizingDivHeight}px">
  <foreignObject width="100%" height="100%">
  ${divChild}
  </foreignObject>
  </svg>
  `;

  // canvas styles
  canvas.width = canvasWidth;
  canvas.height = sizingDivHeight;
  canvas.style.width = canvasWidth / 2 + "px";
  canvas.style.height = sizingDivHeight / 2 + "px";

  //get DPI
  let dpi = window.devicePixelRatio;

  // get context
  var ctx = canvas.getContext("2d");
  ctx.scale(dpi, dpi);

  // create image
  data = encodeURIComponent(data);
  var img = new Image();
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
      newImg.style.border = "1px solid hsl(0,0%,50%)";
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

  img.src = "data:image/svg+xml," + data;
})();

const getTitle = require("./getTitle");
const kebab = require("./kebab");

module.exports = function (console, fileType) {
  console.save = function (data) {
    let mimeType = "text/plain";



    const title = getTitle();
    let filename = kebab(title);

    if (fileType.toLowerCase() === "json") {
      filename += ".json";
      mimeType = "text/json";

      if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4);
      }
    } else if (fileType.toLowerCase() === "md") {
      filename += ".md";
    }

    var blob = new Blob([data], { type: mimeType });
    var a = document.createElement("a");

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = [mimeType, a.download, a.href].join(":");
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
};

const getTimestamp = require("./util/getTimestamp");
const getTitle = require("./util/getTitle");
const html2canvas = require("html2canvas");
const kebab = require("./util/kebab");

(function exportImage() {
    const captureElement = document.querySelector(
        "div.flex.flex-col.text-sm.pb-9"
    );

    const stickyHeaderEle =
        captureElement.querySelector("div.sticky");

    stickyHeaderEle.style.display = "none";
    captureElement.style.backgroundColor = "#191919";
    captureElement.style.paddingBottom = "32px";
    captureElement.style.paddingTop = "56px";
    captureElement.style.position = "relative";

    const style = document.createElement("style");
    document.head.appendChild(style);
    style.sheet?.insertRule(
        "body > div:last-child img { display: inline-block; }"
    );

    const title = getTitle();
    const filename = kebab(title);

    const headerEle = document.createElement("div");
    headerEle.style.position = "absolute";
    headerEle.style.left = "0";
    headerEle.style.right = "0";
    headerEle.style.top = "8px";
    headerEle.style.textAlign = "center";

    const titleEle = document.createElement("h1");
    titleEle.textContent = title;
    titleEle.style.fontSize = "18px";

    const timestampEle = document.createElement("p");
    timestampEle.textContent = getTimestamp();
    timestampEle.style.fontSize = "12px";
    timestampEle.style.opacity = "0.7";

    headerEle.appendChild(titleEle);
    headerEle.appendChild(timestampEle);
    captureElement.prepend(headerEle);

    html2canvas(captureElement, {
        logging: true,
        letterRendering: 1,
        foreignObjectRendering: false,
    })
        .then((canvas) => {
            canvas.style.display = "none";
            document.body.appendChild(canvas);
            return canvas;
        })
        .then((canvas) => {
            const image = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.setAttribute("download", `${filename}.png`);
            a.setAttribute("href", image);
            a.click();
            canvas.remove();
        })
        .then(() => {
            style.remove();
            headerEle.remove();
            stickyHeaderEle.style.display = "auto";
            captureElement.style.backgroundColor = "";
        });
})();

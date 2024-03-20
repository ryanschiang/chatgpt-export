module.exports = function() {
    const titleEle = document.getElementsByTagName("title");
    return titleEle && titleEle.length ? titleEle[0].innerText : "ChatGPT Export";
}
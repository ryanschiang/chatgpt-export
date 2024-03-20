module.exports = function(input) {
    return input
    .trim()
    .toLowerCase()
    .replace(/^[^\w\d]+|[^\w\d]+$/g, "")
    .replace(/[\s\W-]+/g, "-");
}
module.exports = function () {
  return new Date(
    new Date(new Date(new Date()).toISOString()).getTime() -
      new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
};

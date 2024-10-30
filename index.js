// Export other modules for programmatic use
const { convertToTS } = require("./lib/convertToTS") // Adjust the path if necessary
const { docsRouter } = require("./lib/docsRouter") // Adjust the path if necessary

module.exports = {
  convertToTS,
  docsRouter,
}

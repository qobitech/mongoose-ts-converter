const express = require("express")
const fs = require("fs")
const path = require("path")

/**
 * Middleware for serving mongoose-ts-converter documentation.
 *
 * @param {String} outputDir - The directory containing the generated documentation files.
 * @returns {express.Router} - An Express router serving the documentation.
 */
function docsRouter(outputDir) {
  const router = express.Router()

  router.use(express.static(outputDir))

  router.get("/", (req, res) => {
    const docs = fs.readdirSync(outputDir).map((file) => {
      const content = fs.readFileSync(path.join(outputDir, file), "utf-8")
      return { file: path.basename(file, ".d.ts"), content }
    })

    res.send(renderHTML(docs))
  })

  const renderHTML = (docs) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>TypeScript Documentation</title>
      <style> /* Add styles here */ </style>
    </head>
    <body>
      <h1>Generated TypeScript Models</h1>
      ${docs.map((doc) => `<h2>${doc.file}</h2><pre>${doc.content}</pre>`).join("")}
    </body>
    </html>
  `

  return router
}

module.exports = {
  docsRouter,
}

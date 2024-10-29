const express = require("express")
const fs = require("fs")
const path = require("path")
const net = require("net")

function checkPortAvailability(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.once("error", () => resolve(false)) // Port is in use
    server.once("listening", () => {
      server.close(() => resolve(true)) // Port is free
    })
    server.listen(port)
  })
}

/**
 * Start server for mongoose-ts-converter documentation.
 *
 * @param {String} outputDir - The directory containing the Mongoose model files.
 * @param {Number} port - The port number for documentation server.
 *
 * @returns {Promise<{app:Express, server: Server<typeof IncomingMessage, typeof ServerResponse>}>} - Promise of object containing app and server.
 */
async function startDocsServer(outputDir, port) {
  const app = express()
  const PORT = port || process.env.DOCS_PORT || 3000
  // const docsDir = path.join(__dirname, "docs")

  const isAvailable = await checkPortAvailability(PORT)
  if (!isAvailable) {
    console.error(
      `Port ${PORT} is already in use. Please specify a different port.`
    )
    process.exit(1)
  }

  app.use(express.static(outputDir))

  app.get("/", (req, res) => {
    const docs = fs.readdirSync(outputDir).map((file) => {
      const content = fs.readFileSync(path.join(outputDir, file), "utf-8")
      return { file, content }
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

  const server = app.listen(PORT, () =>
    console.log(`Documentation available at http://localhost:${PORT}`)
  )

  return { app, server }
}

module.exports = startDocsServer

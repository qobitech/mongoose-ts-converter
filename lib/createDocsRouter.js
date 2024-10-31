const express = require("express")
const fs = require("fs")
const path = require("path")

/**
 * Middleware for serving mongoose-ts-converter documentation in JSON format to the frontend on request.
 *
 * @param {String} outputDir - The directory containing the generated documentation files.
 * @returns {express.Router} - An Express router serving the documentation.
 */
function createDocsRouter(outputDir) {
  const router = express.Router()

  router.get("/json", (req, res) => {
    try {
      const schemas = fs.readdirSync(outputDir).map((file) => {
        const content = fs.readFileSync(path.join(outputDir, file), "utf-8")
        return {
          file: path.basename(file, ".d.ts"),
          content,
        }
      })
      res.json({ schemas })
    } catch (error) {
      res.status(500).json({ error: "Failed to load schemas" })
    }
  })

  return router
}

module.exports = { createDocsRouter }

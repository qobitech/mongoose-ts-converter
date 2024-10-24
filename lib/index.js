// lib/index.js
const { parseModels } = require("./modelParser")
const { convertToSchema } = require("./schemaConverter")
const { generateTS } = require("./tsGenerator")

const processModels = async (modelDirectory, outputPath) => {
  // Step 1: Parse models from the directory
  const models = parseModels(modelDirectory)

  // Step 2: Convert models to JSON Schema
  const schemas = convertToSchema(models)

  // Step 3: Generate TypeScript definitions
  await generateTS(schemas, outputPath)
}

module.exports = { processModels }

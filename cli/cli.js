#!/usr/bin/env node
const fs = require("fs")
const { program } = require("commander")
const path = require("path")
const { extractModelsToSchemas } = require("../lib/extractModels")
const startDocsServer = require("../lib/docServer") // Import docServer module

program
  .version("1.0.0")
  .description("Generate TypeScript schemas from Mongoose models")
  .requiredOption("-m, --models <dir>", "Location of the model directory")
  .requiredOption("-o, --output <dir>", "Location to output TypeScript schemas")
  .option("--serve", "Start the documentation server after generating schemas")
  .option("--port <number>", "Specify port for documentation server", 3000)
  .parse(process.argv)

const options = program.opts()

// Resolve paths for models and output directories
const modelDir = path.resolve(process.cwd(), options.models)
const outputDir = path.resolve(process.cwd(), options.output)

// Check if the model directory exists
if (!fs.existsSync(modelDir)) {
  console.error(
    `ENOENT: Model directory "${modelDir}" does not exist. \nConversion failed`
  )
  process.exit(1) // Exit with an error code
}

// Check if output directory exists; if not, create it
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// Call the extractor function to generate TypeScript schemas
extractModelsToSchemas(modelDir, outputDir)

// Start the documentation server if the --serve option is specified
if (options.serve) {
  const port = parseInt(options.port, 10)
  startDocsServer(outputDir, port)
}

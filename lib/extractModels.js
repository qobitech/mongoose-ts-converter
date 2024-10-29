const fs = require("fs")
const path = require("path")
const { generateTypeScriptSchema } = require("./utils")

/**
 * Extracts Mongoose models to TypeScript schemas.
 *
 * @param {fs.PathLike} modelDir - The directory containing the Mongoose model files.
 * @param {fs.PathLike} outputDir - The output directory for generated TypeScript schemas.
 * @param {Object} options - Options to control schema extraction.
 * @param {boolean} options.generateDocs - If true, generates documentation alongside TypeScript schemas.
 *
 * @returns {String[]} - Array of JSON schema type representations for each model.
 */
const extractModelsToSchemas = async (
  modelDir,
  outputDir,
  { generateDocs = false }
) => {
  // Ensure output directory exists
  if (!!outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  if (!fs.existsSync(modelDir)) {
    throw new Error("Directory does not exist")
  }

  // Read all files in the model directory
  const files = fs.readdirSync(modelDir)

  files.forEach((file) => {
    const filePath = path.join(modelDir, file)
    if (path.extname(filePath) === ".js") {
      const model = require(filePath) // Require the Mongoose model
      const modelName = path.basename(file, ".js")
      const tsSchema = generateTypeScriptSchema(model)

      // Write the generated TypeScript schema to the output directory
      fs.writeFileSync(
        path.join(outputDir, `${modelName}.d.ts`),
        tsSchema,
        "utf8"
      )

      console.log(`Schema for ${modelName} generated.`)
    }
  })

  // Additional logic to generate documentation if the flag is true
  if (generateDocs) {
    const docsDir = path.join(outputDir, "docs")

    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir)
    }

    // Copy generated types to the docs directory
    fs.readdirSync(outputDir).forEach((file) => {
      if (file.endsWith(".d.ts")) {
        const content = fs.readFileSync(path.join(outputDir, file), "utf-8")
        fs.writeFileSync(path.join(docsDir, file), content)
      }
    })
  }

  return files
}

module.exports = { extractModelsToSchemas }

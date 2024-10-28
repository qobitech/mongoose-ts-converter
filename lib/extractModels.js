const fs = require("fs")
const path = require("path")
const { generateTypeScriptSchema } = require("./utils")

const extractModelsToSchemas = async (modelDir, outputDir) => {
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

  return files
}

module.exports = { extractModelsToSchemas }
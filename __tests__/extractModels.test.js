// __tests__/extractModels.test.js

const { extractModelsToSchemas } = require("../lib/extractModels")
const path = require("path")
const fs = require("fs")

describe("Model Extraction", () => {
  const modelDir = path.join(__dirname, "mockModels")
  const outputDir = path.join(__dirname, "models")

  it("should extract all models from the given directory", async () => {
    const models = await extractModelsToSchemas(modelDir, outputDir, {
      generateDocs: false,
    })
    expect(models).toHaveLength(2) // Assuming we have two mock models in this directory
  })

  it("should verify the content of the generated typescript files", async () => {
    const models = await extractModelsToSchemas(modelDir, outputDir, {
      generateDocs: false,
    })
    models.forEach((model) => {
      const modelName = path.basename(model, ".js")
      const tsFilePath = path.join(outputDir, `${modelName}.d.ts`)
      expect(fs.existsSync(tsFilePath)).toBe(true)
      const tsContent = fs.readFileSync(tsFilePath, "utf8")
      expect(tsContent).toContain(`interface ${modelName}`)
    })
  })

  it("should throw an error if the directory does not exist", async () => {
    const invalidDir = path.join(__dirname, "invalidModels")
    const invalidOutputDir = path.join(__dirname, "invalidOutputmodel")
    await expect(
      extractModelsToSchemas(invalidDir, "", {
        generateDocs: false,
      })
    ).rejects.toThrow("Directory does not exist")
  })
})

// __tests__/extractModels.test.js

const { extractModelsToSchemas } = require("../lib/extractModels")
const path = require("path")

describe("Model Extraction", () => {
  it("should extract all models from the given directory", async () => {
    const modelDir = path.join(__dirname, "mockModels")
    const outputDir = path.join(__dirname, "models")
    const models = await extractModelsToSchemas(modelDir, outputDir)
    expect(models).toHaveLength(2) // Assuming we have two mock models in this directory
  })

  it("should throw an error if the directory does not exist", async () => {
    const invalidDir = path.join(__dirname, "invalidModels")
    await expect(extractModelsToSchemas(invalidDir)).rejects.toThrow(
      "Directory does not exist"
    )
  })
})

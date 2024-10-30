// __tests__/docsRouter.test.js

const request = require("supertest")
const express = require("express")
const { docsRouter } = require("../lib/docsRouter")
const { extractModelsToSchemas } = require("../lib/extractModels")
const path = require("path")
const fs = require("fs")

const app = express()
app.disable("x-powered-by")

describe("GET /docs", () => {
  const modelDir = path.join(__dirname, "mockModels")
  const outputDir = path.join(__dirname, "models")

  beforeEach(() => {
    app.use("/docs", docsRouter(outputDir))
  })

  afterAll(() => {
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true })
    }
  })

  test("should extract all models from the given directory", async () => {
    const models = await extractModelsToSchemas(modelDir, outputDir)
    expect(models).toHaveLength(2) // Assuming we have two mock models in this directory
  })

  test("should return 200 and the documentation content", async () => {
    const response = await request(app).get("/docs/")

    expect(response.statusCode).toBe(200)
    expect(response.headers["content-type"]).toMatch(/html/) // Checks if HTML is served

    // Optionally, verify specific content if there are key markers in the HTML
    expect(response.text).toContain("Generated TypeScript Models")
  })
})

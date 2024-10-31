// __tests__/docsRouter.test.js
const request = require("supertest")
const express = require("express")
const path = require("path")
const fs = require("fs")
const { createDocsRouter } = require("../lib/createDocsRouter")

const app = express()
const outputDir = path.join(__dirname, "models")

describe("GET /docs/json", () => {
  beforeAll(() => {
    // Set up mock schema files in a test output directory
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)
    fs.writeFileSync(
      path.join(outputDir, "User.d.ts"),
      "export interface User { username: string; }"
    )
    fs.writeFileSync(
      path.join(outputDir, "Product.d.ts"),
      "export interface Product { name: string; }"
    )

    // Use the docs router in the Express app
    app.use("/docs", createDocsRouter(outputDir))
  })

  afterAll(() => {
    // Clean up by removing mock schema files
    fs.rmSync(outputDir, { recursive: true, force: true })
  })

  test("should return 200 and a JSON array of schema files with correct content", async () => {
    const response = await request(app).get("/docs/json")

    expect(response.statusCode).toBe(200)
    expect(response.headers["content-type"]).toMatch(/json/)
    expect(response.body.schemas).toEqual([
      {
        file: "Product",
        content: "export interface Product { name: string; }",
      },
      { file: "User", content: "export interface User { username: string; }" },
    ])
  })

  test("should return 500 if the output directory is missing", async () => {
    const invalidOutputDir = path.join(__dirname, "nonExistentDir")
    const tempApp = express()
    tempApp.use("/docs", createDocsRouter(invalidOutputDir))

    const response = await request(tempApp).get("/docs/json")

    expect(response.statusCode).toBe(500)
    expect(response.body).toHaveProperty("error", "Failed to load schemas")
  })
})

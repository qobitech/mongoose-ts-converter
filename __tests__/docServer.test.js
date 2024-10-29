const request = require("supertest")
const path = require("path")
const startDocsServer = require("../lib/docServer")

describe("Documentation Server Tests", () => {
  const outputDir = path.join(__dirname, "models")
  let server
  let app

  afterAll(() => {
    server.close()
  })

  it("should serve documentation at the root endpoint", async () => {
    const docServer = await startDocsServer(outputDir, 3001) // Start server on test port
    server = docServer.server
    app = docServer.app
    const response = await request(app).get("/")
    expect(response.status).toBe(200)
    expect(response.text).toContain("<h1>Generated TypeScript Models</h1>")
  })
})

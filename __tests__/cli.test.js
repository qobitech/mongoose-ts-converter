const { spawn, exec } = require("child_process")
const fs = require("fs")
const path = require("path")

describe("CLI Tool - Mongoose to TypeScript", () => {
  const modelDir = path.join(__dirname, "mockModels") // Directory with your Mongoose models
  const outputDir = path.join(__dirname, "models") // Directory to save generated schemas

  beforeEach(() => {
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true })
    }
    fs.mkdirSync(outputDir)
  })

  afterAll(() => {
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true })
    }
  })

  test("should generate TypeScript schemas from Mongoose models", (done) => {
    const cliPath = path.resolve("cli/cli.js")
    const process = spawn("node", [
      cliPath,
      "--models",
      modelDir,
      "--output",
      outputDir,
    ])

    process.on("close", (code) => {
      expect(code).toBe(0) // Check if the CLI exited successfully

      // Verify the output files
      const expectedFiles = ["User.d.ts", "Order.d.ts"] // Adjust to match your models
      expectedFiles.forEach((file) => {
        const filePath = path.join(outputDir, file)
        expect(fs.existsSync(filePath)).toBe(true)
      })

      done()
    })
  })

  test("should error when required arguments are missing", (done) => {
    const cliPath = path.resolve("cli/cli.js")
    const process = spawn("node", [cliPath])

    process.stderr.on("data", (data) => {
      expect(data.toString()).toContain("error: required option")
      done()
    })
  })

  test("should error when model directory does not exist", (done) => {
    const cliPath = path.resolve("cli/cli.js")
    const nonExistentDir = path.resolve("non-existent-dir")
    const process = spawn("node", [
      cliPath,
      "--models",
      nonExistentDir,
      "--output",
      outputDir,
    ])

    process.stderr.on("data", (data) => {
      expect(data.toString()).toContain("ENOENT") // Directory not found error
      done()
    })
  })

  test("should overwrite existing files in output directory", (done) => {
    const cliPath = path.resolve("cli/cli.js")
    const dummyFilePath = path.join(outputDir, "User.d.ts")
    fs.writeFileSync(dummyFilePath, "Dummy content")

    const process = spawn("node", [
      cliPath,
      "--models",
      modelDir,
      "--output",
      outputDir,
    ])

    process.on("close", (code) => {
      expect(code).toBe(0)
      const content = fs.readFileSync(dummyFilePath, "utf-8")
      expect(content).not.toContain("Dummy content") // Ensure it's overwritten
      done()
    })
  })

  test("should handle schema conversion errors gracefully", (done) => {
    const cliPath = path.resolve("cli/cli.js")
    const invalidModelDir = path.join(__dirname, "invalidModels") // Folder with invalid model
    const process = spawn("node", [
      cliPath,
      "--models",
      invalidModelDir,
      "--output",
      outputDir,
    ])

    process.stderr.on("data", (data) => {
      expect(data.toString()).toContain("Conversion failed")
      done()
    })
  })

  test("should set correct permissions for generated files", (done) => {
    const cliPath = path.resolve("cli/cli.js")
    const process = spawn("node", [
      cliPath,
      "--models",
      modelDir,
      "--output",
      outputDir,
    ])

    process.on("close", (code) => {
      expect(code).toBe(0)
      const filePath = path.join(outputDir, "User.d.ts")
      const stats = fs.statSync(filePath)
      expect(stats.mode & 0o777).toBe(0o644) // Check read/write permissions for owner
      done()
    })
  })

  test("should start the documentation server with --serve option", (done) => {
    const serverProcess = exec(
      `node ./cli/cli.js -m ${modelDir} -o ${outputDir} --serve`
    )

    serverProcess.stdout.on("data", (data) => {
      if (data.includes("Documentation available at")) {
        expect(data).toContain(
          "Documentation available at http://localhost:3000"
        )
        serverProcess.kill()
        done()
      }
    })
  })

  test("should start the server on a custom port", (done) => {
    const customPort = 4000
    const serverProcess = exec(
      `node ./cli/cli.js -m ${modelDir} -o ${outputDir} --serve --port ${customPort}`
    )

    serverProcess.stdout.on("data", (data) => {
      if (data.includes(`http://localhost:${customPort}`)) {
        expect(data).toContain(`http://localhost:${customPort}`)
        serverProcess.kill()
        done()
      }
    })
  })
})

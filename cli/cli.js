// cli/cli.js
const readline = require("readline")
const { processModels } = require("../lib/index")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question("Enter the path to the model directory: ", (modelDirectory) => {
  rl.question(
    "Enter the output path for the TypeScript schemas: ",
    (outputPath) => {
      // Process the models
      processModels(modelDirectory, outputPath)
        .then(() => {
          console.log("TypeScript schemas generated successfully!")
          rl.close()
        })
        .catch((err) => {
          console.error("Error:", err)
          rl.close()
        })
    }
  )
})

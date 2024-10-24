// lib/tsGenerator.js
const { compile } = require("json-schema-to-typescript")
const fs = require("fs")

const generateTS = async (schemas, outputPath) => {
  for (const modelName in schemas) {
    const ts = await compile(schemas[modelName], modelName)
    fs.writeFileSync(`${outputPath}/${modelName}.d.ts`, ts)
  }
}

module.exports = { generateTS }

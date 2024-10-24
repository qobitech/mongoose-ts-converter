// lib/modelParser.js
const fs = require("fs")
const path = require("path")
const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default

const parseModels = (modelDirectory) => {
  const models = {}
  const files = fs.readdirSync(modelDirectory)

  files.forEach((file) => {
    const filePath = path.join(modelDirectory, file)
    const code = fs.readFileSync(filePath, "utf8")
    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["classProperties"],
    })

    traverse(ast, {
      ObjectExpression(path) {
        const schemaFields = {}
        path.node.properties.forEach((prop) => {
          const key = prop.key.name
          const value = prop.value.properties.reduce((acc, field) => {
            acc[field.key.name] = field.value.name || field.value.value
            return acc
          }, {})
          schemaFields[key] = value
        })
        models[file.replace(".js", "")] = schemaFields
      },
    })
  })

  return models
}

module.exports = { parseModels }

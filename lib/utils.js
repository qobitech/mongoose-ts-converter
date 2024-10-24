const fs = require("fs")
const path = require("path")

/**
 * Reads all files from the given directory and returns an array of file paths.
 * @param {string} directoryPath - The path to the directory to scan.
 * @returns {Array<string>} - An array of file paths.
 */
function readFilesFromDirectory(directoryPath) {
  return fs
    .readdirSync(directoryPath)
    .map((file) => path.join(directoryPath, file))
}

/**
 * Checks if a given object is a valid Mongoose model schema.
 * @param {Object} modelSchema - The schema to validate.
 * @returns {boolean} - Returns true if the schema is valid, false otherwise.
 */
function isValidMongooseSchema(modelSchema) {
  return typeof modelSchema === "object" && modelSchema.hasOwnProperty("paths")
}

/**
 * Error handling utility to format error messages.
 * @param {string} message - The error message.
 * @returns {Error} - Returns a new Error object.
 */
function createError(message) {
  return new Error(`Mongoose TS Converter Error: ${message}`)
}

// Helper function to map Mongoose types to TypeScript types
const mongooseTypeToTsType = (mongooseType) => {
  switch (mongooseType) {
    case String:
      return "string"
    case Number:
      return "number"
    case Boolean:
      return "boolean"
    case Date:
      return "Date"
    case Array:
      return "any[]"
    case Object:
      return "Record<string, any>"
    default:
      return "any"
  }
}

const generateTypeScriptSchema = (model) => {
  const schema = model.schema.obj // Access Mongoose schema object
  let tsSchema = `declare interface ${model.modelName} {\n`

  for (const [key, value] of Object.entries(schema)) {
    const type = mongooseTypeToTsType(value)
    tsSchema += `  ${key}: ${type};\n`
  }

  tsSchema += "}\n"
  return tsSchema
}

module.exports = {
  readFilesFromDirectory,
  isValidMongooseSchema,
  createError,
  generateTypeScriptSchema,
}

const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose")

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
  // Direct type mapping for basic types
  switch (mongooseType) {
    case String:
    case mongoose.Schema.Types.String:
      return "string"
    case Number:
    case mongoose.Schema.Types.Number:
      return "number"
    case Boolean:
    case mongoose.Schema.Types.Boolean:
      return "boolean"
    case Date:
    case mongoose.Schema.Types.Date:
      return "Date"
    case mongoose.Schema.Types.ObjectId:
      return "mongoose.Types.ObjectId"
    case Array:
      return "any[]" // Generic array type, customized in parsing
    default:
      return "any"
  }
}

const inspectField = (field) => {
  // Check if the field is an array and get its type
  if (Array.isArray(field)) {
    const arrayType = field[0]?.type || "any"
    return `${mongooseTypeToTsType(arrayType)}[]`
  }

  // Handle nested schema objects
  if (field && typeof field === "object" && field.type == null) {
    return `{ ${Object.entries(field).map(
      ([key, val]) => `${key}: ${inspectField(val)}`
    )} }`
  }

  // Single type field, directly map type
  return mongooseTypeToTsType(field.type || field)
}

const generateTypeScriptSchema = (model) => {
  const schema = model.schema.obj
  let tsSchema = `declare interface ${model.modelName} {\n`

  for (const [key, field] of Object.entries(schema)) {
    // const isOptional = !field.required
    // const optionalSymbol = isOptional ? "?" : ""
    // tsSchema += `  ${key}${optionalSymbol}: ${inspectField(field)};\n`
    tsSchema += `  ${key}: ${inspectField(field)};\n`
  }

  tsSchema += "}\n"
  return tsSchema
}

// Utility function to ensure the directory exists
const ensureDirectoryExists = (directory) => {
  // if (!fs.existsSync(directory)) {
  fs.mkdir(directory, (error) => {
    if (error) {
      console.log(`Directory ${directory} not created.`)
    } else {
      console.log(`Directory ${directory} created.`)
    }
  })
  // }
}

module.exports = {
  readFilesFromDirectory,
  isValidMongooseSchema,
  createError,
  generateTypeScriptSchema,
  ensureDirectoryExists,
  inspectField,
}

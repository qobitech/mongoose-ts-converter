const mongoose = require("mongoose")
const { compile } = require("json-schema-to-typescript")
const { isValidMongooseSchema, createError } = require("./utils") // Import utilities

/**
 * Converts a Mongoose schema to a JSON schema.
 * @param {mongoose.Schema} schema - The Mongoose schema.
 * @returns {Object} - The converted JSON schema.
 */
function convertMongooseSchemaToJsonSchema(schema) {
  if (!isValidMongooseSchema(schema)) {
    throw createError("Invalid Mongoose schema provided")
  }

  const jsonSchema = {
    title: schema.constructor.modelName,
    type: "object",
    properties: {},
    required: [],
  }

  for (let path in schema.paths) {
    if (schema.paths.hasOwnProperty(path)) {
      const mongooseType = schema.paths[path].instance

      // Mapping Mongoose types to JSON Schema types
      switch (mongooseType) {
        case "String":
          jsonSchema.properties[path] = { type: "string" }
          break
        case "Number":
          jsonSchema.properties[path] = { type: "number" }
          break
        case "Boolean":
          jsonSchema.properties[path] = { type: "boolean" }
          break
        case "Date":
          jsonSchema.properties[path] = { type: "string", format: "date-time" }
          break
        case "Array":
          jsonSchema.properties[path] = {
            type: "array",
            items: { type: "string" }, // You can improve this with more specific handling
          }
          break
        // Add more cases as needed for other Mongoose types
        default:
          jsonSchema.properties[path] = { type: "string" } // Defaulting to string
          break
      }

      // Check if the field is required
      if (schema.paths[path].isRequired) {
        jsonSchema.required.push(path)
      }
    }
  }

  return jsonSchema
}

/**
 * Converts a Mongoose model schema to TypeScript interface using json-schema-to-typescript.
 * @param {mongoose.Schema} schema - The Mongoose schema.
 * @returns {Promise<string>} - The TypeScript interface as a string.
 */
async function convertToTS(schema) {
  try {
    const jsonSchema = convertMongooseSchemaToJsonSchema(schema) // Convert to JSON schema
    const tsInterface = await compile(jsonSchema, schema.constructor.modelName) // Convert JSON schema to TypeScript interface
    return tsInterface
  } catch (error) {
    throw createError(`Conversion failed: ${error.message}`)
  }
}

module.exports = {
  convertToTS,
}

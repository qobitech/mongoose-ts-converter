const mongoose = require("mongoose")
const { compile } = require("json-schema-to-typescript")
const { isValidMongooseSchema, createError } = require("./utils")

/**
 * Maps a Mongoose type to a JSON schema type.
 * @param {Object} schemaType - The type definition in Mongoose schema.
 * @returns {Object} - JSON schema type representation.
 */
function mapMongooseTypeToJsonSchema(schemaType) {
  if (schemaType === String) return { type: "string" }
  if (schemaType === Number) return { type: "number" }
  if (schemaType === Boolean) return { type: "boolean" }
  if (schemaType === Date) return { type: "string", format: "date-time" }
  if (Array.isArray(schemaType)) {
    // Handle array items more dynamically
    return {
      type: "array",
      items: mapMongooseTypeToJsonSchema(
        schemaType[0]?.type || schemaType[0] || "string"
      ),
    }
  }
  if (schemaType && typeof schemaType === "object") {
    // Recursively handle nested object structures
    return {
      type: "object",
      properties: convertSchemaDefinitionToJsonSchema(schemaType).properties,
      required: convertSchemaDefinitionToJsonSchema(schemaType).required,
      additionalProperties: false, // Explicitly disallow additional properties
    }
  }
  return { type: "string" } // Default to string if type is unknown
}

/**
 * Converts Mongoose schema fields to JSON schema properties.
 * @param {Object} schemaObj - Mongoose schema object definition.
 * @returns {Object} - JSON schema properties and required fields.
 */
function convertSchemaDefinitionToJsonSchema(schemaObj) {
  const jsonSchemaProperties = {}
  const requiredFields = []

  for (const [key, value] of Object.entries(schemaObj)) {
    const isRequired = value.required || false
    jsonSchemaProperties[key] = mapMongooseTypeToJsonSchema(value.type || value)

    if (isRequired) {
      requiredFields.push(key)
    }
  }

  return { properties: jsonSchemaProperties, required: requiredFields }
}

/**
 * Converts a Mongoose schema to a JSON schema.
 * @param {mongoose.Schema} schema - The Mongoose schema.
 * @returns {Object} - JSON schema.
 */
function convertMongooseSchemaToJsonSchema(schema) {
  const { properties, required } = convertSchemaDefinitionToJsonSchema(
    schema.obj
  )

  return {
    title: schema.constructor.modelName,
    type: "object",
    properties,
    required,
    // additionalProperties: false, // Disable additional properties
  }
}

/**
 * Converts a Mongoose model schema to TypeScript interface using json-schema-to-typescript.
 * @param {mongoose.Schema} schema - The Mongoose schema.
 * @param {string} modelName - The Mongoose model name.
 * @returns {Promise<string>} - TypeScript interface as a string.
 */
async function convertToTS(schema, modelName) {
  try {
    const jsonSchema = convertMongooseSchemaToJsonSchema(schema)
    let tsInterface = await compile(jsonSchema, modelName, {
      bannerComment: "",
    })
    // Remove '[k: string]: unknown;' from the output
    tsInterface = tsInterface.replace(/\[k: string\]: unknown;/g, "")
    return tsInterface
  } catch (error) {
    throw createError(`Conversion failed: ${error.message}`)
  }
}

module.exports = {
  convertToTS,
}

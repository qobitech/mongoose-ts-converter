// lib/schemaConverter.js
const convertToSchema = (models) => {
  const schemas = {}

  for (const modelName in models) {
    const modelFields = models[modelName]
    const schema = {
      title: modelName,
      type: "object",
      properties: {},
      required: [],
    }

    for (const field in modelFields) {
      schema.properties[field] = { type: modelFields[field] }
      schema.required.push(field)
    }

    schemas[modelName] = schema
  }

  return schemas
}

module.exports = { convertToSchema }

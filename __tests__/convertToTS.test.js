// __tests__/convertToTS.test.js

const { convertToTS } = require("../lib/convertToTS")
const mongoose = require("mongoose")

describe("TypeScript Schema Conversion", () => {
  it("should convert a simple Mongoose model to TypeScript schema", async () => {
    const schema = new mongoose.Schema({
      username: { type: String, required: true },
      email: { type: String, required: true },
    })

    const userSchema = mongoose.model("User", schema)

    const tsSchema = await convertToTS(userSchema.schema, userSchema.modelName)

    expect(tsSchema).toContain("interface User")
    expect(tsSchema).toContain("username: string;")
    expect(tsSchema).toContain("email: string;")
  })

  it("should handle complex data types like arrays and nested objects", async () => {
    const schema = new mongoose.Schema({
      items: [{ type: String }],
      customer: {
        name: { type: String, required: true },
        age: { type: Number },
      },
    })

    const complexModel = mongoose.model("Order", schema)

    const tsSchema = await convertToTS(
      complexModel.schema,
      complexModel.modelName
    )

    expect(tsSchema).toContain("interface Order")
    expect(tsSchema).toContain("items?: string[];")

    // Remove line breaks and extra spaces for consistent comparison
    const formattedTsInterface = tsSchema.replace(/\s+/g, " ").trim()
    const formattedExpected = "customer?: { name: string; age?: number; };"
      .replace(/\s+/g, " ")
      .trim()
    expect(formattedTsInterface).toContain(formattedExpected)
  })
})

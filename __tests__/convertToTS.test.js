// __tests__/convertToTS.test.js

const { convertToTS } = require("../lib/convertToTS")

describe("TypeScript Schema Conversion", () => {
  it("should convert a simple Mongoose model to TypeScript schema", async () => {
    const mongooseModel = {
      name: "User",
      schema: {
        username: { type: String, required: true },
        email: { type: String, required: true },
      },
    }

    const tsSchema = await convertToTS(mongooseModel)
    expect(tsSchema).toContain("interface User")
    expect(tsSchema).toContain("username: string;")
    expect(tsSchema).toContain("email: string;")
  })

  it("should handle complex data types like arrays and nested objects", async () => {
    const complexModel = {
      name: "Order",
      schema: {
        items: [{ type: String }],
        customer: {
          name: { type: String, required: true },
          age: { type: Number },
        },
      },
    }

    const tsSchema = await convertToTS(complexModel)
    expect(tsSchema).toContain("interface Order")
    expect(tsSchema).toContain("items: string[];")
    expect(tsSchema).toContain("customer: { name: string; age?: number; };")
  })
})

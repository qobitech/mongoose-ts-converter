// __tests__/mockModels/Order.js
const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  items: [{ type: String }],
  customer: {
    name: { type: String, required: true },
    age: { type: Number },
  },
})

module.exports = mongoose.model("Order", orderSchema)

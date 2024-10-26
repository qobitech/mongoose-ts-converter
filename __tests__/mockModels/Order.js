// __tests__/mockModels/Order.js
const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  items: [{ type: String, required: true }],
  customer: {
    name: { type: String, required: true },
    age: { type: Number },
    registered: { type: Boolean },
  },
})

module.exports = mongoose.model("Order", orderSchema)

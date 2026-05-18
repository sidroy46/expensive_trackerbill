const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  vendorName: { type: String, required: true },
  date: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  category: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  expenseType: { type: String, required: true },
  imageUrl: { type: String }, // path to the uploaded image
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);

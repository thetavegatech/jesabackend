const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  occupation: { type: String, required: true },
  source: { type: String, required: true },
  place: { type: String, required: true },
  status: { type: String },
  qrCodeUrl: { type: String, required: true },// Add this line
  gender: { type: Number },
});

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  place: { type: String, required: true },
  phone: { type: String, required: true },
  source: { type: String, required: true },
  members: [MemberSchema], // Embed the member schema
  occupation: { type: String, required: true },
  qrCodeUrl: { type: String, required: true },
  status: { type: String },
  gender: { type: Number },
});

module.exports = mongoose.model('JesaCustomer', CustomerSchema);

const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  occupation: { type: String},
  source: { type: String},
  place: { type: String},
  status: { type: String },
  qrCodeUrl: { type: String },
  gender: { type: String},
  phone: { type: String, unique: true },
});

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  place: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, unique: true },
  source: { type: String, required: true },
  members: [MemberSchema], // Embed the member schema
  occupation: { type: String, required: true },
  qrCodeUrl: { type: String, required: true },
  status: { type: String },
  gender: { type: String, required: true },
  member: { type: Number },
});

module.exports = mongoose.model('JesaCustomer', CustomerSchema);

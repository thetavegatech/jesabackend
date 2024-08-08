const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  occupation: { type: String},
  source: { type: String},
  place: { type: String},
  status: { type: String, default: 'Pending' },
  qrCodeUrl: { type: String },
  gender: { type: String },
  phone: { type: String },
});

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  place: { type: String, required: true },
  age: { type: String, required: true },
  phone: { type: String },
  source: { type: String, required: true },
  members: [MemberSchema], // Embed the member schema
  occupation: { type: String, required: true },
  qrCodeUrl: { type: String},
  // status: { type: String },
  status: { type: String, default: 'Pending' },
  gender: { type: String },
  member: { type: Number },
});

module.exports = mongoose.model('JesaCustomer', CustomerSchema);

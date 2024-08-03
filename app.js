
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require("cors");
const cookieparser = require("cookie-parser")
const app = express();
const fs = require('fs');
const QRCode = require('qrcode');
const Grid = require('gridfs-stream');
const customerRoutes = require('./Router');
const Customer = require('./Model')

// const AssetMaster = require('./models/AssetModel')

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(cookieparser())




// const mongourl = "mongodb://localhost:27017/MaintenX?directConnection=true" 
const mongourl = "mongodb+srv://vaibhavdevkar101:Vaibhav123@cluster0.518nyqj.mongodb.net/Jesa?retryWrites=true&w=majority"


mongoose.connect(mongourl, {
})
  .then(() => { console.log("connected to database"); })
  .catch(e => console.log(e));

  
// Routes
app.use('/api', customerRoutes);

app.get('/api/customer/by-qrcode', async (req, res) => {
  const { qrCodeData } = req.query;

  if (!qrCodeData) {
    return res.status(400).json({ message: 'QR code data is required' });
  }

  try {
    // Assuming qrCodeData is a comma-separated string in the format:
    // "name, phone, source, membersJson, occupation"
    const [name, phone, source, occupation] = qrCodeData.split(', ');

    // Find the customer based on the extracted data
    const customer = await Customer.findOne({
      name,
      phone,
      source,
      occupation
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer by QR code:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(4000, (req, res) => {
  console.log("Server is running on port 4000")
});
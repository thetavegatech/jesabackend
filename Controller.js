const Customer = require('./Model');
const mongoose = require('mongoose');
const QRCode = require('qrcode');

// Create a new customer
// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    // Destructure members and the rest of the customer data
    const { members, ...customerData } = req.body;

    console.log('Received customer data:', customerData);
    console.log('Received members data:', members);

    // Validate required fields for customer
    if (!customerData.name || !customerData.place || !customerData.phone || !customerData.source || !customerData.occupation) {
      return res.status(400).json({ message: 'Missing required customer data' });
    }

    if (!Array.isArray(members)) {
      return res.status(400).json({ message: 'Members must be an array' });
    }

    // Generate QR code for the customer
    const customerQRCodeData = `${customerData.name}, ${customerData.place}, ${customerData.phone}, ${customerData.source}, ${JSON.stringify(members)}, ${customerData.occupation}`;
    const customerQRCodeUrl = await QRCode.toDataURL(customerQRCodeData);

    // Create a new customer object with customer QR code URL
    const newCustomer = new Customer({ ...customerData, qrCodeUrl: customerQRCodeUrl });

    // Generate QR codes for each member
    const updatedMembers = await Promise.all(members.map(async (member, index) => {
      try {
        // Validate required fields for each member
        if (!member.name || member.age === undefined || !member.occupation) {
          throw new Error(`Missing required member data at index ${index}`);
        }
        const memberQRCodeData = `${member.name}, ${member.age}, ${member.occupation}`;
        const memberQRCodeUrl = await QRCode.toDataURL(memberQRCodeData);
        return { ...member, qrCodeUrl: memberQRCodeUrl };
      } catch (memberError) {
        throw new Error(`Error generating QR code for member at index ${index}: ${memberError.message}`);
      }
    }));

    // Assign the updated members with QR codes to the customer
    newCustomer.members = updatedMembers;

    // Save the customer to the database
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Error creating customer:', error); // Log the error for debugging
    res.status(400).json({ message: error.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCustomerById1 = async (req, res) => {
  try {
    const { name, phone } = req.query;

    // Validate input
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone number are required' });
    }

    // Find customer with matching name and phone number
    const customer = await Customer.findOne({ name, phone });

    // If no customer is found
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Return found customer
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a customer by ID
exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a customer by ID
exports.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get customer by member info
exports.getCustomerByMember = async (req, res) => {
    try {
      const { name, place } = req.query; // Retrieve member information from query parameters
  
      if (!name || !place) {
        return res.status(400).json({ message: 'Name and place are required' });
      }
  
      // Find customers with matching member info
      const customers = await Customer.find({
        'members.name': name,
        'members.place': place
      });
  
      if (customers.length === 0) {
        return res.status(404).json({ message: 'No customers found with the provided member info' });
      }
  
      res.status(200).json(customers);
    } catch (error) {
      console.error('Error fetching customer by member:', error); // Log the error for debugging
      res.status(500).json({ message: error.message });
    }
  };

  exports.getMemberById = async (req, res) => {
    const { customerId, memberId } = req.params;
    console.log(`Finding customer with ID: ${customerId}`);
    console.log(`Finding member with ID: ${memberId}`);
  
    try {
      const customer = await Customer.findById(customerId);
      console.log('Customer found:', customer);
  
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      const member = customer.members.id(memberId);
      console.log('Member found:', member);
  
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
  
      res.json(member);
    } catch (error) {
      console.error('Error fetching member:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

// Get a customer by name and phone number
// Get a customer by name and phone number, returning only the ID and QR code URL
exports.getCustomerByNameAndPhone = async (req, res) => {
    try {
      const { name, phone } = req.query;
  
      // Validate input
      if (!name || !phone) {
        return res.status(400).json({ message: 'Name and phone number are required' });
      }
  
      // Find customer with matching name and phone number
      const customer = await Customer.findOne({ name, phone });
  
      // If no customer is found
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      // Return found customer
      res.status(200).json(customer);
    } catch (error) {
      // Log error and return response
      console.error('Error fetching customer by name and phone:', error);
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update customer status to 'OK' by ID
  exports.updateCustomerStatus = async (req, res) => {
    try {
      const customerId = req.params.id;
  
      // Validate the ID format
      if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return res.status(400).json({ message: 'Invalid customer ID format' });
      }
  
      // Find the customer by ID
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      // Update the customer's status
      customer.status = req.body.status; // Use the status from the request body
      const updatedCustomer = await customer.save();
  
      res.status(200).json(updatedCustomer);
    } catch (error) {
      console.error('Error updating customer status:', error);
      res.status(500).json({ message: error.message });
    }
  };

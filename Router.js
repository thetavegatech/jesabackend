const express = require('express');
const router = express.Router();
const customerController = require('./Controller');

// Route to create a new customer
router.post('/customers', customerController.createCustomer);

// Route to get all customers
router.get('/customers', customerController.getAllCustomers);

// Route to get a customer by ID
router.get('/customers/:id', customerController.getCustomerById);

// Route to update a customer by ID
router.patch('/customers/:id', customerController.updateCustomer);
 
// Route to delete a customer by ID
router.delete('/customers/:id', customerController.deleteCustomer);

// Route to get a customer by member info
router.get('/customers/member', customerController.getCustomerByMember);

router.get('/api/customers/by-name-phone', customerController.getCustomerByNameAndPhone);


router.get('/customer/:customerId/members/:memberId', customerController.getMemberById);

router.get('/customer/by-name-phone', customerController.getCustomerById1);


module.exports = router;

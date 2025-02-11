const Customer = require('../models/customerModel');

// add a new customer
const addCustomer = async (req, res) => {
    try {
        const { name, email, phone, company, notes } = req.body;
        const newCustomer = new Customer({ name, email, phone, company, notes });
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ message: "Error adding customer", error });
    }
};

// list all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customers", error });
    }
};

// Belirli bir müşteriyi alma
const getCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customer", error });
    }
};

// update a customer
const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, company, notes } = req.body;
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(id, { name, email, phone, company, notes }, { new: true });
        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: "Error updating customer", error });
    }
};

// delete a customer
const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting customer", error });
    }
};

module.exports = {
    addCustomer,
    getAllCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer
};

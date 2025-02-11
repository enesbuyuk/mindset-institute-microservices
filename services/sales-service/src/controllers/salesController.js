const Sales = require('../models/salesModel');

// create a new sale
const createSale = async (req, res) => {
    try {
        const { customerId, notes } = req.body;

        const newSale = new Sales({ customerId, notes });
        await newSale.save();

        res.status(201).json({ message: 'Sale created successfully!', sale: newSale });
    } catch (error) {
        res.status(400).json({ message: 'Error creating sale', error: error.message });
    }
};

// update sale status
const updateSaleStatus = async (req, res) => {
    try {
        const { saleId } = req.params;
        const { status, notes } = req.body;

        const sale = await Sales.findById(saleId);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        sale.status = status;
        sale.statusNotes = notes || '';
        sale.statusChangeDate = Date.now();

        await sale.save();

        res.status(200).json({ message: 'Sale status updated successfully!', sale });
    } catch (error) {
        res.status(400).json({ message: 'Error updating sale status', error: error.message });
    }
};

// get all sales
const getSales = async (req, res) => {
    try {
        const sales = await Sales.find().populate('customerId', 'name email');
        res.status(200).json(sales);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching sales', error: error.message });
    }
};

module.exports = { createSale, updateSaleStatus, getSales };

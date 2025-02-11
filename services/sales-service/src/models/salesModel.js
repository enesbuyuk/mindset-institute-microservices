const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    status: {
        type: String,
        enum: ['Yeni', 'İletişimde', 'Anlaşma', 'Kapandı'],
        default: 'Yeni'
    },
    notes: { type: String },
    saleDate: { type: Date, default: Date.now },
    statusChangeDate: { type: Date, default: Date.now },
    statusNotes: { type: String, default: '' }
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;

const mongoose = require('mongoose');
const Customer = require('../src/models/customerModel');
const dotenv = require('dotenv');

dotenv.config();

beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Customer Model', () => {
    let customerId;

    it('should create and save a customer successfully', async () => {
        const newCustomer = new Customer({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            company: 'Example Corp',
            notes: 'Test customer'
        });

        const savedCustomer = await newCustomer.save();

        expect(savedCustomer._id).toBeDefined();
        expect(savedCustomer.name).toBe('John Doe');
        expect(savedCustomer.email).toBe('john@example.com');

        customerId = savedCustomer._id;
    });

    it('should throw an error if required fields are missing', async () => {
        const newCustomer = new Customer({
            email: 'missingFields@example.com'
        });

        try {
            await newCustomer.save();
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.errors.name).toBeDefined();
        }
    });

    it('should get a customer by ID', async () => {
        const customer = await Customer.findById(customerId);

        expect(customer).toBeDefined();
        expect(customer._id.toString()).toBe(customerId.toString());
        expect(customer.name).toBe('John Doe');
    });

    it('should update a customer', async () => {
        const updatedData = {
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '9876543210',
            company: 'New Example Corp',
            notes: 'Updated customer'
        };

        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updatedData, { new: true });

        expect(updatedCustomer.name).toBe(updatedData.name);
        expect(updatedCustomer.email).toBe(updatedData.email);
        expect(updatedCustomer.phone).toBe(updatedData.phone);
    });

    it('should delete a customer', async () => {
        const deletedCustomer = await Customer.findByIdAndDelete(customerId);

        expect(deletedCustomer).toBeDefined();
        expect(deletedCustomer._id.toString()).toBe(customerId.toString());

        const customer = await Customer.findById(customerId);
        expect(customer).toBeNull();
    });
});

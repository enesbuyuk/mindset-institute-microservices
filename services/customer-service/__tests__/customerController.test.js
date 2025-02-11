const request = require('supertest');
const app = require('../src');
const mongoose = require('mongoose');
const Customer = require('../src/models/customerModel');

beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Customer CRUD operations', () => {
    let customerId;

    // Test 1: Yeni müşteri ekleme
    it('should add a new customer', async () => {
        const newCustomer = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            company: 'Example Corp',
            notes: 'Test customer'
        };

        const res = await request(app).post('').send(newCustomer);

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe(newCustomer.name);
        expect(res.body.email).toBe(newCustomer.email);

        customerId = res.body._id; // Yeni eklenen müşterinin ID'sini al
    });

    // Test 2: Tüm müşterileri getirme
    it('should get all customers', async () => {
        const res = await request(app).get('');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0); // En az bir müşteri olması beklenir
    });

    // Test 3: Belirli bir müşteriyi getirme
    it('should get a single customer', async () => {
        const res = await request(app).get(`/${customerId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(customerId);
        expect(res.body.name).toBe('John Doe');
    });

    // Test 4: Müşteri güncelleme
    it('should update a customer', async () => {
        const updatedData = {
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '9876543210',
            company: 'New Example Corp',
            notes: 'Updated customer'
        };

        const res = await request(app)
            .put(`/${customerId}`)
            .send(updatedData);

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe(updatedData.name);
        expect(res.body.email).toBe(updatedData.email);
    });

    // Test 5: Müşteri silme
    it('should delete a customer', async () => {
        const res = await request(app).delete(`/${customerId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Customer deleted successfully');

        // Müşteriyi tekrar almayı deneyelim, hata döndürmelidir
        const getRes = await request(app).get(`/${customerId}`);
        expect(getRes.statusCode).toBe(404);
    });
});

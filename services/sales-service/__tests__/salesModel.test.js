const mongoose = require('mongoose');
const Sales = require('../src/models/salesModel');
const request = require('supertest');
const app = require('../src'); // Express app dosyasının doğru yolu burada olmalı
const dotenv = require('dotenv');

dotenv.config();

let saleId;

beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Sales API', () => {

    it('should create a new sale', async () => {
        const res = await request(app)
            .post('//create')
            .send({
                customerId: '60c72b2f5b4c3f001f8e4c4d', // Geçerli bir customerId yazmanız gerekebilir
                notes: 'Sale created for testing.',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Sale created successfully!');
        expect(res.body.sale.customerId).toBe('60c72b2f5b4c3f001f8e4c4d'); // Beklenen customerId
        saleId = res.body.sale._id; // Daha sonra güncellemelerde kullanacağız
    });

    it('should update the sale status', async () => {
        const res = await request(app)
            .put(`//update/${saleId}`)
            .send({
                status: 'İletişimde',
                notes: 'Contacted the customer.',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Sale status updated successfully!');
        expect(res.body.sale.status).toBe('İletişimde');
        expect(res.body.sale.statusNotes).toBe('Contacted the customer.');
    });

    it('should fail to update the sale status for a non-existing sale', async () => {
        const res = await request(app)
            .put('//update/invalidSaleId')
            .send({
                status: 'Kapandı',
                notes: 'Closed the deal.',
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Sale not found');
    });

    it('should fetch all sales', async () => {
        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].customerId).toBeDefined();
        expect(res.body[0].status).toBeDefined();
        expect(res.body[0].saleDate).toBeDefined();
        expect(res.body[0].statusChangeDate).toBeDefined();
    });
});

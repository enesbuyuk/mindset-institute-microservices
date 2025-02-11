const request = require("supertest");
const app = require("../src");
const User = require("../src/models/userModel");
const mongoose = require("mongoose");
const dotenv = require("dotenv")

dotenv.config();

describe("Authentication API Test", () => {
    beforeAll(async () => {
        await mongoose.connect(`${process.env.DB_URI}`, { useNewUrlParser: true, useUnifiedTopology: true });
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("should register a new user", async () => {
        const res = await request(app).post("/register").send({
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            email: "john@example.com",
            password: "password123",
            role: "user",
        });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("user");
    });

    it("should not register a user with missing fields", async () => {
        const res = await request(app).post("/register").send({
            username: "janedoe"
        });

        expect(res.statusCode).toEqual(400);
    });

    it("should login a user", async () => {
        await request(app).post("/register").send({
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            email: "john@example.com",
            password: "password123",
            role: "user",
        });

        const res = await request(app).post("/login").send({
            email: "john@example.com",
            password: "password123"
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("token");
    });

    it("should reject login with wrong password", async () => {
        const res = await request(app).post("/login").send({
            email: "john@example.com",
            password: "wrongpassword"
        });

        expect(res.statusCode).toEqual(401);
    });
});

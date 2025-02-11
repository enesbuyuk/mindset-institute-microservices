const mongoose = require("mongoose");
const User = require("../src/models/userModel");
const dotenv = require("dotenv")

dotenv.config();

describe("User Model Test", () => {
    beforeAll(async () => {
        await mongoose.connect(`${process.env.DB_URI}`, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("should create a user successfully", async () => {
        const user = new User({
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            email: "john@example.com",
            password: "securepassword",
            role: "user",
        });

        const savedUser = await user.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.email).toBe("john@example.com");
    });

    it("should fail if required fields are missing", async () => {
        const user = new User({ username: "janedoe" });
        let err;
        try {
            await user.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
    });
});

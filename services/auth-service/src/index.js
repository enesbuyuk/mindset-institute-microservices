const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const {setupSwagger} = require("./swagger");
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json()); // Bu satırı ekleyin
app.use(express.urlencoded({ extended: true })); // Form verilerini de handle etmek için
app.use(cors());

// Swagger Setup
setupSwagger(app);

// Routes
app.use('/auth', authRoutes);

mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log('Connected to MongoDB!');
        app.listen(PORT, () => {
            console.log(`Auth service running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error);
    });

module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const salesRoutes = require('./routes/salesRoutes');
const {setupSwagger} = require('./swagger');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

// Swagger Setup
setupSwagger(app);

// Routes
app.use('/', salesRoutes);

// MongoDB Connection
mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log('Connected to MongoDB!');
        app.listen(PORT, () => {
            console.log(`Sales service running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT;

// Urls of Microservices Swagger JSON files
const services = [
    { name: "Auth Service", url: `http://auth-service:${process.env.AUTH_SERVICE_PORT}/swagger.json` },
    { name: "Customer Service", url: `http://customer-service:${process.env.CUSTOMER_SERVICE_PORT}/swagger.json`},
    { name: "Sales Service", url: `http://sales-service:${process.env.SALES_SERVICE_PORT}/swagger.json` }
];

// Swagger JSON files are aggregated
async function getAggregatedDocs() {
    let paths = {};
    let definitions = {};
    let tags = [];
    let securitySchemes = {};

    for (let service of services) {
        try {
            const response = await axios.get(service.url);
            const serviceDocs = response.data;

            for (let path in serviceDocs.paths) {
                paths[path] = serviceDocs.paths[path];
            }

            if (serviceDocs.definitions) {
                Object.assign(definitions, serviceDocs.definitions);
            }

            // Servis Tag'lerini ekle
            if (serviceDocs.tags) {
                tags.push(...serviceDocs.tags);
            }

            // Security (JWT) bilgilerini birleştir
            if (serviceDocs.components && serviceDocs.components.securitySchemes) {
                Object.assign(securitySchemes, serviceDocs.components.securitySchemes);
            }

        } catch (error) {
            console.error(`❌ ${service.name} Swagger JSON alınamadı:`, error.message);
        }
    }

    return {
        openapi: "3.0.0",
        info: {
            title: "Aggregated API Gateway Docs",
            version: "1.0.0",
        },
        paths,
        components: {
            schemas: definitions,
            securitySchemes,
        },
        security: [
            {
                BearerAuth: []
            }
        ],
        tags
    };
}

// Swagger UI Endpoint
app.use('/api-docs', swaggerUi.serve, async (req, res, next) => {
    const swaggerDocument = await getAggregatedDocs();
    swaggerUi.setup(swaggerDocument)(req, res, next);
});

// API Gateway başlat
app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
    console.log(`📄 Swagger Aggregation available at http://localhost:${PORT}/api-docs`);
});

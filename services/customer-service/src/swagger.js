const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");

dotenv.config();

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Customer Service API in "+ process.env.PROJECT_NAME,
            version: "1.0.0",
            description: "API documentation for customer service in "+ process.env.PROJECT_NAME,
        },
        servers: [
            {
                url: `http://0.0.0.0:${process.env.PORT}`,
                description: "Docker container for this service",
            },
        ],
    },
    apis: ["./src/routes/customerRoutes.js"],
};

const swaggerSpec = swaggerJsDoc(options);

function setupSwagger(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = {
    swaggerSpec,
    setupSwagger,
};

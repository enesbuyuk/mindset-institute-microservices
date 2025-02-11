const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");

dotenv.config();

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sales Service API in " + process.env.PROJECT_NAME,
            version: "1.0.0",
            description: "API documentation for sales service in " + process.env.PROJECT_NAME,
        },
        servers: [
            {
                url: `http://0.0.0.0:${process.env.PORT}`,
                description: "Docker container for this service",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    apis: ["./src/routes/salesRoutes.js"],
};

const swaggerSpec = swaggerJsDoc(options);

function setupSwagger(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = {
    swaggerSpec,
    setupSwagger,
};

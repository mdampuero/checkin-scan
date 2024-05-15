const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Checkin-Scan",
            version: "1.0.0",
            description:
                "Checkin-Scan Api Products",
            contact: {
                name: "Mauricio Ampuero",
                email: "mdampuero@gmail.com",
            },
        },
        servers: [
            {
                url: "https://checkin-scan.latamhosting.net",
            },
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./routes/*.routes.js"],
};

const specs = swaggerJsdoc(swaggerOptions);

module.exports = specs;

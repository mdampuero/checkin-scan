const express = require('express')
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require("swagger-ui-express");
const specs = require("./swaggerOptions");
const path = require('path');
const { logger } = require('../helpers/utils');
const { SERVER_RUNNING } = require('../helpers/constants');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000
        this.server = require('http').createServer(this.app)

        //Middlewares
        this.middlewares();

        //Routes
        this.routes();

    }

    middlewares() {

        this.app.use(cors());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use((req, res, next) => {
            const fullPath = req.url;
            logger.info(fullPath)
            next();
        });
    }

    routes() {
        this.app.use('/api/auth', require('../routes/auth.routes'));
        this.app.use('/api/products', require('../routes/products.routes'));
        this.app.use('/api-docs',
            swaggerUi.serve,
            swaggerUi.setup(specs)
        );
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(SERVER_RUNNING + this.port);
        })
    }
}

module.exports = Server;
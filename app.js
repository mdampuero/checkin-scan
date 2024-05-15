
require('dotenv').config();
/**
 * Delay waiting for mariadb server to be ready
 */
setTimeout(() => {
    const Server = require('./models/server');
    const server = new Server();
    server.listen();
}, 3000);

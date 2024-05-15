const bcryptjs = require('bcryptjs');
const winston = require("winston");

const encryptPassword = async (password) => {
    const salt = bcryptjs.genSaltSync(10);
    user.password = bcryptjs.hashSync(salt);
}

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: "./var/app.log" }),
    ],
});

module.exports = {
    encryptPassword,
    logger
}
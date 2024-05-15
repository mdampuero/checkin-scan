require('dotenv').config();
const jwt = require('jsonwebtoken');
const { CAN_NOT_GENERATE_TOKEN } = require('../helpers/constants');
const { logger } = require('../helpers/utils');

const generateJWT = (id = '') => {
    return new Promise((resolve, reject) => {
        const payload = { id }
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        }, (err, token) => {
            if (err) {
                logger.error(err);
                reject(CAN_NOT_GENERATE_TOKEN)
            } else {
                resolve(token);
            }
        })
    })
}

module.exports = {
    generateJWT
}
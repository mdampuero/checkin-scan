const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const { generateJWT } = require("../helpers/generate-jwt");
const { BAD_CREDENTIALS, INTERNAL_SERVER_ERROR } = require('../helpers/constants');
const { logger } = require('../helpers/utils');

/**
 * 
 * @param {email, password } req 
 * @param {token} res 
 * @returns 
 */
const login = async (req = request, res = response) => {
    try {
        const { password } = req.body;
        const user = req.user;
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            logger.warn(BAD_CREDENTIALS);
            return res.status(401).json({ message: BAD_CREDENTIALS });
        } else {
            const token = await generateJWT(user.id);
            logger.info(token);
            return res.json({ token });
        }
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            message: INTERNAL_SERVER_ERROR
        })
    }
}

module.exports = {
    login
}
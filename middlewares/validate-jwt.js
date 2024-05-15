const jwt = require('jsonwebtoken');
const User = require("../models/user");
const { logger } = require('../helpers/utils');
const { TOKEN_INVALID, RESOURCE_NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../helpers/constants');
const validateJWT = async (req = request, res, next) => {
    const token = req.header('x-token');
    try {
        if (!token)
            throw TOKEN_INVALID;
        const { id } = jwt.verify(token, process.env.SECRET)
        const user = await User.findByPk(id);
        if (!user)
            throw RESOURCE_NOT_FOUND;
        req.user = user
        next();
    } catch (e) {
        logger.error(e)
        return res.status(401).json({
            message: TOKEN_INVALID
        })
    }
}

module.exports = {
    validateJWT
}
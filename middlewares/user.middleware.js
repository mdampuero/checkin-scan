const User = require("../models/user");
const { RESOURCE_NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../helpers/constants');
const { logger } = require('../helpers/utils');

const isUserExist = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            logger.warn(RESOURCE_NOT_FOUND);
            return res.status(404).json({ message: RESOURCE_NOT_FOUND });
        }
        req.user = user;
        next();
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
};

module.exports = {
    isUserExist
}
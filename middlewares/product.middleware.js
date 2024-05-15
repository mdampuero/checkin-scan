const Product = require("../models/product");
const { Sequelize } = require('sequelize');
const { RESOURCE_NOT_FOUND, INTERNAL_SERVER_ERROR, TITLE_ALREADY_EXIST } = require('../helpers/constants');
const { logger } = require('../helpers/utils');

const isUniqueTitle = async (title,{ req }) => {
    const { id = 0 } = req.params;
    const exist = await Product.findOne({ where: { title , id: { [Sequelize.Op.ne]: id }} });
    if (exist) {
        logger.warn(TITLE_ALREADY_EXIST);
        throw new Error(TITLE_ALREADY_EXIST);
    }
}

const isProductExist = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            logger.warn(RESOURCE_NOT_FOUND);
            return res.status(404).json({ message: RESOURCE_NOT_FOUND });
        }
        req.product = product;
        next();
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
};

module.exports = {
    isUniqueTitle,
    isProductExist
}
const { response, request } = require("express");
const Product = require("../models/product");
const { Sequelize } = require('sequelize');
const { DEFAULT_LIMIT, DEFAULT_FIELD, DEFAULT_DIRECTION, DEFAULT_OFFSET, RESOURCE_DELETED, RESOURCE_UPDATED, INTERNAL_SERVER_ERROR } = require('../helpers/constants');
const { logger } = require('../helpers/utils');

const productsGet = async (req = request, res = response) => {
    try {
        const { offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT, query = '' } = req.query;
        const { count, rows } = await Product.findAndCountAll({
            where: {
                [Sequelize.Op.or]: [
                    { title: { [Sequelize.Op.like]: `%${query}%` } },
                    { description: { [Sequelize.Op.like]: `%${query}%` } }
                ]
            },
            order: [[DEFAULT_FIELD, DEFAULT_DIRECTION]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        return res.json({
            data: rows,
            total: count,
            pages: Math.ceil(count / limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            message: INTERNAL_SERVER_ERROR
        })
    }
}

const productsGetOne = async (req, res = response) => {
    try {
        return res.json(req.product);
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            message: INTERNAL_SERVER_ERROR
        })
    }
}

const productsPost = async (req, res = response) => {
    try {
        const { title, price, description, status } = req.body;
        const product = new Product({ title, price, status, description });
        await product.save();
        logger.info(product);
        return res.status(201).json(product)
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            message: INTERNAL_SERVER_ERROR
        })
    }
}

const productsPut = async (req, res = response) => {
    try {
        const { title, price, description, status } = req.body;
        await Product.update(
            { title, price, status, description },
            {
                where: {
                    id: req.product.id
                }
            }
        );
        logger.info(RESOURCE_UPDATED);
        return res.json({
            message: RESOURCE_UPDATED
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            message: INTERNAL_SERVER_ERROR
        })
    }
}

const productsDelete = async (req, res = response) => {
    try {
        await Product.update(
            { deletedAt: new Date() },
            {
                where: {
                    id: req.product.id
                }
            }
        );
        logger.info(RESOURCE_DELETED);
        return res.json({
            message: RESOURCE_DELETED
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            message: INTERNAL_SERVER_ERROR
        })
    }
}

module.exports = {
    productsGet,
    productsPost,
    productsPut,
    productsDelete,
    productsGetOne
}
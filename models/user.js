require('dotenv').config();
const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');
const bcryptjs = require('bcryptjs');
const { logger } = require('../helpers/utils');
const { USER_DEFAULT_CREATED } = require('../helpers/constants');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    paranoid: true
});


User.afterSync('createDefaultUser', async () => {
    try {
        let user = {
            name: process.env.DEFAULT_USER_NAME,
            email: process.env.DEFAULT_USER_EMAIL,
            password: ''
        }
        const existingUser = await User.findOne({ where: { email: user.email } });
        if (!existingUser) {
            const salt = bcryptjs.genSaltSync(10);
            user.password = bcryptjs.hashSync(process.env.DEFAULT_USER_PASS, salt);
            await User.create(user);
            logger.info(USER_DEFAULT_CREATED);
        }
    } catch (error) {
        logger.error(error);
    }
});
User.sync();

module.exports = User;
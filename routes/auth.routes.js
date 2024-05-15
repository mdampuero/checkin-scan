const { Router } = require('express');
const { login } = require('../controllers/auth.controllers');
const { check } = require('express-validator');
const { validateFields, isUserExist } = require('../middlewares/');
const { EMAIL_REQUIRED, EMAIL_INVALID, PASSWORD_REQUIRED } = require('../helpers/constants');
const swaggerDocs = require("../models/swaggerOptions");
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Login
 *   description: Inicia sesión
 * components:
 *   schemas:
 *     Token:
 *       type: string
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *
 */


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión
 *     description: Genera un JSON Web Token (JWT) tras autenticar las credenciales del usuario.
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Token de autenticación JWT generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post('/login', [
    check('email', EMAIL_REQUIRED).not().isEmpty(),
    check('email', EMAIL_INVALID).isEmail(),
    check('password', PASSWORD_REQUIRED).not().isEmpty(),
    validateFields,
    isUserExist,
], login);

module.exports = router
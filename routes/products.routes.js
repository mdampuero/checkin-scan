const { Router } = require('express');
const { check } = require('express-validator');
const { productsGet, productsPut, productsPost, productsDelete, productsGetOne } = require('../controllers/products.controllers');
const { validateFields, validateJWT, isProductExist, isUniqueTitle } = require('../middlewares');
const { ID_INVALID, TITLE_REQUIRED, TITLE_SHORT, PRICE_REQUIRED, PRICE_INVALID, STATUS_INVALID } = require('../helpers/constants');
const swaggerDocs = require("../models/swaggerOptions");
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operaciones relacionadas con productos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         status:
 *           type: boolean
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
 * /api/products:
 *   get:
 *     summary: Obtiene todos los productos
 *     description: Obtiene todos los productos disponibles. Puede incluir parámetros de consulta para buscar, limitar, ordenar y paginar los resultados.
 *     tags: [Products]
 *     parameters:
 *       - in: header
 *         name: x-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Búsqueda por título o descripción
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número máximo de registros a devolver por página
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Número de registros para omitir (paginación)
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       400:
 *         description: Error en los datos de entrada
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

router.get('/', [
    validateJWT
], productsGet);


/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto
 *     description: Crea un nuevo producto con los datos proporcionados
 *     tags: [Products]
 *     parameters:
 *       - in: header
 *         name: x-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 64
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               status:
 *                 type: boolean
 *             required:
 *               - title
 *               - price
 *               - status
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 price:
 *                   type: number
 *                 description:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       400:
 *         description: Error en los datos de entrada
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
router.post('/', [
    validateJWT,
    check('title', TITLE_REQUIRED).not().isEmpty(),
    check('title', TITLE_SHORT).isLength({ max: 64 }),
    check('title').custom(isUniqueTitle),
    check('price', PRICE_REQUIRED).not().isEmpty(),
    check('price', PRICE_INVALID).isNumeric(),
    check('status', STATUS_INVALID).isBoolean(),
    validateFields
], productsPost);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtiene un producto por su ID
 *     description: Obtiene un producto utilizando su ID
 *     tags: [Products]
 *     parameters:
 *       - in: header
 *         name: x-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a obtener
 *     responses:
 *       200:
 *         description: Producto obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 price:
 *                   type: number
 *                 description:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto no encontrado
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
router.get('/:id', [
    validateJWT,
    check('id', ID_INVALID).isNumeric(),
    validateFields,
    isProductExist
], productsGetOne);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualiza un producto existente
 *     description: Actualiza un producto utilizando su ID
 *     tags: [Products]
 *     parameters:
 *       - in: header
 *         name: x-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 64
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               status:
 *                 type: boolean
 *             required:
 *               - title
 *               - price
 *               - status
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 price:
 *                   type: number
 *                 description:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto no encontrado
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
router.put('/:id', [
    validateJWT,
    check('id', ID_INVALID).isNumeric(),
    check('title', TITLE_REQUIRED).not().isEmpty(),
    check('title', TITLE_SHORT).isLength({ max: 64 }),
    check('title').custom(isUniqueTitle),
    check('price', PRICE_REQUIRED).not().isEmpty(),
    check('price', PRICE_INVALID).isNumeric(),
    check('status', STATUS_INVALID).isBoolean(),
    validateFields,
    isProductExist
], productsPut);


/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Elimina un producto existente
 *     description: Elimina un producto utilizando su ID
 *     tags: [Products]
 *     parameters:
 *       - in: header
 *         name: x-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto no encontrado
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
router.delete('/:id', [
    validateJWT,
    check('id', ID_INVALID).isNumeric(),
    validateFields,
    isProductExist
], productsDelete);

module.exports = router
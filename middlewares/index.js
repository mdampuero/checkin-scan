const  validateFields = require('../middlewares/validate');
const  validateJWT  = require('../middlewares/validate-jwt');
const  product  = require('../middlewares/product.middleware');
const  user  = require('../middlewares/user.middleware');

module.exports = {
    ...validateFields,
    ...validateJWT,
    ...product,
    ...user
}
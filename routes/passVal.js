const { Router } = require('express');
const { check } = require('express-validator');

const { valFields } = require('../middlewares/val-fields');

const { userExistingId } = require('../helpers/db-validator');

const { passValidate } = require('../controllers/passVal');

const router = Router();

router.post('/', [
    check('id', 'El id es requerido').not().isEmpty(),
    check('id', 'El id debe ser numérico').isNumeric(),
    check('id').custom( userExistingId ),
    check('contra_act', 'La contraseña actual es requerida').not().isEmpty(),
    valFields
],passValidate);


module.exports = router;
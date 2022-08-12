const { Router } = require('express');
const { check } = require('express-validator');

const {
    valFields, 
    valJWT, 
    adminRole, 
    hasRole,
   
} = require('../middlewares');

const { validType } = require('../helpers/db-validator');

const { getAllTypes, getOneType, createNewType, updateOneType, deleteOneType } = require('../controllers/typeController');


const router = Router();

router.get('/', getAllTypes);


router.get('/:id', [
    check('id', 'Is not a valid ID').isNumeric(),
    check('id').custom( validType ),
    valFields
], getOneType);


router.put('/:id', [
    valJWT,
    adminRole,
    hasRole(1),
    check('id', 'Is not a valid ID').isNumeric(),
    check('id').custom( validType ),
    check('type_name', 'The name is required').not().isEmpty(),
    valFields
], updateOneType);


router.post('/', [
    valJWT,
    adminRole,
    hasRole(1),
    check('type_name', 'The name is required').not().isEmpty(),
    valFields
], createNewType);

router.delete('/:id', [
    valJWT,
    adminRole,
    hasRole(1),
    check('id', 'Is not a valid ID').isNumeric(),
    check('id').custom(validType),
    valFields
], deleteOneType);

module.exports = router;
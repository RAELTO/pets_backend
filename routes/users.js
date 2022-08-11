const { Router } = require('express');
const { check } = require('express-validator');

const {
    valFields, 
    valJWT, 
    adminRole, 
    hasRole,
    validateFileUpload
} = require('../middlewares');

const { emailValidator, userExistingId,
    validRoles } = require('../helpers/db-validator');

const { getAllUsers,
        getOneUser,
        createNewUser,
        updateOneUser,
        deleteOneUser } = require('../controllers/userController');


const router = Router();

router.get('/', getAllUsers);

router.get('/:id' , [
    check('id', 'Is not a valid ID').isNumeric(),
    check('id').custom( userExistingId ),
    valFields
], getOneUser);

router.put('/:id', [
    valJWT,
    adminRole,
    hasRole(1),
    check('id', 'Is not a valid ID').isNumeric(),
    check('id').custom( userExistingId ),
    check('name', 'The name is required').not().isEmpty(),
    check('lastName', 'the last name is required').not().isEmpty(),
    check('email', 'the given email is not valid').isEmail(),
    check('phoneNumber', 'The phoneNumber is required').not().isEmpty(),
    check('role_id', 'the role id must be a number').isNumeric(),
    check('role_id', 'the role id is required').not().isEmpty(),
    check('role_id').custom( validRoles ),
    check('status', 'the user status is required').not().isEmpty(),
    check('status', 'the user status must be a boolean').isBoolean(),
    valFields
], updateOneUser);

router.post('/', [
    /*valJWT,
    adminRole,
    hasRole(1),*/
    check('name', 'The name is required').not().isEmpty(),
    check('lastName', 'the last name is required').not().isEmpty(),
    check('email', 'the given email is not valid').isEmail(),
    check('email').custom( emailValidator ),
    check('phoneNumber', 'The phoneNumber is required').not().isEmpty(),
    check('role_id', 'the role id is required').not().isEmpty(),
    check('role_id', 'the role id must be a number').isNumeric(),
    check('role_id').custom( validRoles ),
    check('status', 'the user status is required').not().isEmpty(),
    check('status', 'the user status must be a boolean').isBoolean(),
    check('password', 'The password is required').not().isEmpty(),
    validateFileUpload,
    valFields
],createNewUser);

router.delete('/:id', [
    valJWT,
    adminRole,
    hasRole(1),
    check('id', 'Is not a valid ID').isNumeric(),
    check('id').custom( userExistingId ),
    valFields
], deleteOneUser);

module.exports = router;
const { Router } = require('express');
const { check } = require('express-validator');

const {
    valFields, 
    valJWT, 
    adminRole, 
    hasRole,
    validateFileUpload
} = require('../middlewares');

const { validRace, userExistingId, 
    petExistingId, validType } = require('../helpers/db-validator');

const { getAllPets,
        getOnePet,
        createNewPet,
        updateOnePet,
        deleteOnePet } = require('../controllers/petController');


const router = Router();

router.get('/', getAllPets);

router.get('/:id' , [
    check('id', 'Is not a valid ID').isNumeric(),
    check('id').custom( petExistingId ),
    valFields
], getOnePet);

router.put('/:id', [
    valJWT,
    adminRole,
    hasRole(1),
    check('id', 'Is not a valid ID').isNumeric(),
    check('id').custom( petExistingId ),
    check('name', 'The name is required').not().isEmpty(),
    check('race_id', 'the race id is required').not().isEmpty(),
    check('race_id', 'the race id must be a number').isNumeric(),
    check('race_id').custom( validRace ),
    check('age', 'the race id is required').not().isEmpty(),
    check('age', 'the age id must be a number').isNumeric(),
    check('type_id', 'is not a valid Type ID').isNumeric(),
    check('type_id', 'The type is required').not().isEmpty(),
    check('type_id').custom( validType ),
    check('status', 'The status is required').not().isEmpty(),
    check('status', 'the pet status must be a boolean').isBoolean(),
    valFields
], updateOnePet);

router.post('/', [//as an user can give a pet for adoption, then admin role is not required
    valJWT,
    check('name', 'The name is required').not().isEmpty(),
    check('race_id', 'the race id is required').not().isEmpty(),
    check('race_id', 'the race id must be a number').isNumeric(),
    check('race_id').custom( validRace ),
    check('age', 'the race id is required').not().isEmpty(),
    check('age', 'the age id must be a number').isNumeric(),
    check('type_id', 'is not a valid Type ID').isNumeric(),
    check('type_id', 'The type is required').not().isEmpty(),
    check('type_id').custom( validType ),
    check('status', 'The status is required').not().isEmpty(),
    check('status', 'the pet status must be a boolean').isBoolean(),
    validateFileUpload,
    valFields
],createNewPet);

router.delete('/:id', [
    valJWT,
    adminRole,
    hasRole(1),
    check('id', 'Is not a valid ID').isNumeric(),
    check('id').custom( petExistingId ),
    valFields
], deleteOnePet);

module.exports = router;
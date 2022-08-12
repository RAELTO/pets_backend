const { Router } = require('express');
const { check } = require('express-validator');

const {
    valFields, 
    valJWT, 
    adminRole, 
    hasRole,
    
} = require('../middlewares');

const { getAllRaces, getOneRace, createNewRace, updateOneRace, deleteOneRace } = require('../controllers/raceController');
const { validRace } = require('../helpers/db-validator');

const router = Router();

router.get('/', getAllRaces);

router.get('/:id', [
    check('id', 'Is not a valid ID').isNumeric(),
    check('id').custom( validRace ),
    valFields
], getOneRace);


router.put('/:id', [
    valJWT,
    adminRole,
    hasRole(1),
    check('id', 'Is not a valid ID').isNumeric(),
    check('id').custom( validRace ),
    check('race_name', 'The name is required').not().isEmpty(),
    valFields
], updateOneRace);


router.post('/', [
    valJWT,
    adminRole,
    hasRole(1),
    check('race_name', 'The name is required').not().isEmpty(),
    valFields
], createNewRace);

router.delete('/:id', [
    valJWT,
    adminRole,
    hasRole(1),
    check('id', 'Is not a valid ID').isNumeric(),
    check('id').custom(validRace),
    valFields
], deleteOneRace);


module.exports = router;
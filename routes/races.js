const { Router } = require('express');

const { getAllRaces } = require('../controllers/raceController');


const router = Router();

router.get('/', getAllRaces);

module.exports = router;
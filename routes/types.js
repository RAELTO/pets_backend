const { Router } = require('express');

const { getAllTypes } = require('../controllers/typeController');


const router = Router();

router.get('/', getAllTypes);

module.exports = router;
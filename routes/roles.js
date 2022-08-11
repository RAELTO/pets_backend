const { Router } = require('express');

const { getAllRoles } = require('../controllers/roleController');


const router = Router();

router.get('/', getAllRoles);

module.exports = router;
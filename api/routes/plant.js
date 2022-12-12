const express = require('express');
const plantController = require('../controllers/plant');

const router = express.Router();

router.post('/photo', plantController.searchPlant);

module.exports = router;

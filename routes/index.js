const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/items', require('./items'));

module.exports = router;

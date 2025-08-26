const express = require('express');
const router = express.Router();
const {getallusers, getuser} = require('../controllers/user.controller');

router.post('/all', getallusers);

module.exports = router;
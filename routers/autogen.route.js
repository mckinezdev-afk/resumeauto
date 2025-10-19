const express = require('express');
const router = express.Router();
const autogenController = require('../controllers/autogen.controller');    
const { getuser } = require('../controllers/user.controller');  
// Add other controllers as needed  
// Define routes
router.post('/answer', getuser, autogenController.answer);       
// router.post('/answer', autogenController.answer);       

module.exports = router;
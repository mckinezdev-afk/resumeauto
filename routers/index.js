const express = require('express');
const router = express.Router();
const autoRoute = require('./autogen.route'); // Import other routes as needed
const userRoute = require('./user.route');

router.use('/autogen', autoRoute); // Use other routes as needed
router.use('/user', userRoute);

module.exports = router;
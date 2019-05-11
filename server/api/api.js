const express = require('express');
const DBController = require('./../database/dbController');
const apiEvents = require('./apiHandles/apiEvents');
const apiUsers = require('./apiHandles/apiUsers');
const apiDepartments = require('./apiHandles/apiDepartments');

const router = express.Router();

router.use('/users/', apiUsers);
router.use('/events/', apiEvents);
router.use('/departments/', apiDepartments);

module.exports = router;

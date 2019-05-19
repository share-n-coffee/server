const express = require('express');
const apiEvents = require('./apiHandles/apiEvents');
const apiUsers = require('./apiHandles/apiUsers');
const apiDepartments = require('./apiHandles/apiDepartments');
const apiRandomizer = require('./apiHandles/apiRandomizer');

const router = express.Router();

router.use('/users/', apiUsers);
router.use('/events/', apiEvents);
router.use('/departments/', apiDepartments);
router.use('/randomizer/', apiRandomizer);

module.exports = router;

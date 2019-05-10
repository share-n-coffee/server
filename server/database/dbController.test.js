const mongoose = require('mongoose');
const connectDatabase = require('../lib/connectDatabase.js');
const demoUsers = require('./models/demo/user.js');
const demoEvents = require('./models/demo/event.js');
const demoDepartments = require('./models/demo/department.js');
const controller = require('./dbController.js');

controller.bind(null, demoUsers, demoEvents, demoDepartments);

connectDatabase();

console.log(demoUsers);

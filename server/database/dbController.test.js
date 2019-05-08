const mongoose = require('mongoose');
const controller = require('./dbController.js');
const UserSchema = require('./models/user.js');
const connectDatabase = require('./connectDatabase.js');

connectDatabase();
const demoUsers = mongoose.model('demo_user', new UserSchema());

console.log(demoUsers);

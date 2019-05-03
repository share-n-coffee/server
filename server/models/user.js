const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  banned: {
    type: Boolean,
    required: true
  },
  events: {
    type: Array,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true
  }
});

module.exports = User = mongoose.model('User', UserSchema);

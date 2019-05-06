const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {
    type: String,
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
  isBanned: {
    type: Boolean,
    required: true,
    default: false
  },
  events: {
    type: Array,
    required: true,
    default: []
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  birthday: {
    type: Date,
    required: true,
    default: null
  },
  gender: {
    type: String,
    required: true,
    default: null
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  logs: {
    acceptedEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }],
    visitedEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }],
    bans: [{
      date: Date,
      duration: Date
    }]
  },
  admin: {
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    },
    password: {
      type: String,
      required: true,
      default: null
    }
  }
});

module.exports = User = mongoose.model('User', UserSchema);

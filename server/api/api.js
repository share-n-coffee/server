const express = require('express');
const mongoose = require('mongoose');
const config = require('../config/config');
const DBController = require('./../database/dbController');

const router = express.Router();

router.get('/users/:user_telegram_id', (req, res) => {
  DBController.getUserByTelegramId(req.params.user_telegram_id)
    .then(user =>
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(user)
    )
    .catch(error => res.status(422).send(error));
});

router.get('/events/:event_id', (req, res) => {
  DBController.getEventById(req.params.event_id)
    .then(event =>
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(event)
    )
    .catch(error => res.status(422).send(error));
});

router.get('/events/', (req, res) => {
  DBController.getAllEvents()
    .then(events =>
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(events)
    )
    .catch(error => res.status(422).send(error));
});

router.get('/departments/', (req, res) => {
  DBController.getAllDepartments()
    .then(departments =>
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(departments)
    )
    .catch(error => res.status(422).send(error));
});

router.put('/users/:user_telegram_id/:department_id', (req, res) => {
  DBController.putUserDepartment(
    req.params.user_telegram_id,
    req.params.department_id
  )
    .then(user =>
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(user)
    )
    .catch(error => res.status(422).send(error));
});

module.exports = router;

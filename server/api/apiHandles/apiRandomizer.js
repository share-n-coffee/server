const express = require('express');
const objectIdValidation = require('../../middleware/objectIdValidation');
const RandController = require('../../randomizer/randController');

const router = express.Router();

router.route('/:id', objectIdValidation).post((req, res) => {
  RandController.checkAllData();
  RandController.selectEventForPairGenerating(req.params.id);
  res.status(200).send('ok');
});

module.exports = router;

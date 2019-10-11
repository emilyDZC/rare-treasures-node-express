const express = require('express');
const treasuresRouter = express.Router();
const {
  getTreasures,
  postTreasure,
  patchTreasure
} = require('../controllers/treasures');
const { notAllowed } = require('../errors');

treasuresRouter
  .route('/')
  .get(getTreasures)
  .post(postTreasure)
  .all(notAllowed);

treasuresRouter
  .route('/:id')
  .patch(patchTreasure)
  .all(notAllowed);

module.exports = { treasuresRouter };

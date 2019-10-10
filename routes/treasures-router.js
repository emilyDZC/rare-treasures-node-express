const express = require('express');
const treasuresRouter = express.Router();
const {
  getTreasures,
  postTreasure,
  patchTreasure
} = require('../controllers/treasures');

treasuresRouter
  .route('/')
  .get(getTreasures)
  .post(postTreasure);

treasuresRouter.route('/:id').patch(patchTreasure);

module.exports = { treasuresRouter };

const {
  fetchTreasureData,
  insertTreasure,
  updateTreasure
} = require('../models/treasures');

function getTreasures(req, res, next) {
  fetchTreasureData(req.query)
    .then(treasures => {
      res.send({ treasures });
    })
    .catch(next);
}

function postTreasure(req, res, next) {
  insertTreasure(req.body)
    .then(treasure => {
      res.status(201).send({ treasure });
    })
    .catch(next);
}

function patchTreasure(req, res, next) {
  updateTreasure(req.params.id, req.body)
    .then(treasure => {
      res.status(200).send({ treasure });
    })
    .catch(next);
}

module.exports = { getTreasures, postTreasure, patchTreasure };

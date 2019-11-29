const {
  fetchTreasureData,
  insertTreasure,
  updateTreasure,
  removeTreasure
} = require("../models/treasures");

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

function deleteTreasure(req, res, next) {
  const { id } = req.params;
  removeTreasure(id)
    .then(num => {
      if (!num) next({ code: "noTreasure" });
      else res.status(200).send({ msg: "Treasure successfully deleted" });
    })
    .catch(next);
}

module.exports = { getTreasures, postTreasure, patchTreasure, deleteTreasure };

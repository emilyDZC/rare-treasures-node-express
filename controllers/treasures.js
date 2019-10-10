const { fetchTreasureData } = require('../models/treasures');

function getTreasures(req, res, next) {
  fetchTreasureData(req.query)
    .then(treasures => {
      res.send({ treasures });
    })
    .catch(next);
}

module.exports = { getTreasures };

const data = require('./data');
const { mapOwners } = require('../utils/map-owners');

exports.seed = function(connection, Promise) {
  return connection
    .insert(data.ownerData)
    .into('owners')
    .returning('*')
    .then(insertedOwners => {
      console.log(data.shopData);
      console.log(mapOwners(insertedOwners, data.shopData));
    });
};

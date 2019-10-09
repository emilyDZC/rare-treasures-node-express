const _ = require('lodash');

const mapItems = (reference, toBeMapped, key, name, replaced) => {
  if (!reference.length) return [];
  const obj = {};
  reference.forEach((ref, index) => {
    obj[ref[key]] = ref[name];
  });

  const output = [];
  toBeMapped.forEach(item => {
    output.push({ ...item });
  });

  const inverted = _.invert(obj);
  let returnArr = output.map(item => {
    item[key] = inverted[item[replaced]];
    delete item[replaced];
    return item;
  });
  return returnArr;
};

module.exports = { mapItems };

const { expect } = require('chai');
const { mapOwners } = require('../utils/map-owners');

describe('mapOwners', () => {
  it('returns an empty array when given an empty array', () => {
    expect(mapOwners([])).to.eql([]);
  });
  it('returns one object in an array with the owner name changed to id, when passed one object', () => {
    const shopData = [{ shop_name: 'shop-b', owner: 'firstname-b', slogan: 'slogan-b' }];  
    const ownerData = [{ owner_id: '1', forename: 'firstname-b'}]
    const output = [{ shop_name: 'shop-b', slogan: 'slogan-b', owner_id: '1' }];
    expect(mapOwners(ownerData, shopData)).to.eql(output);
  });
});
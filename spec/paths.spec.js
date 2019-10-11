process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const { app } = require('../app');
const chai_sorted = require('chai-sorted');
chai.use(chai_sorted);
const { connection } = require('../db/connection');

describe('endpoints', () => {
  after(() => {
    connection.destroy();
  });
  it('Status 404: path not found for invalid path', () => {
    return request(app)
      .get('/api/sdfsdf')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal('Route not found');
      });
  });
  describe('/api', () => {
    describe('/treasures', () => {
      it('Status 405: should only allow GET and POST methods', () => {
        const notAllowed = ['put', 'patch', 'delete'];
        const promises = notAllowed.map(method => {
          return request(app)
            [method]('/api/treasures')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method not allowed!');
            });
        });
        return Promise.all(promises);
      });
      describe('GET', () => {
        it('Status 200: should successfully connect to endpoint', () => {
          return request(app)
            .get('/api/treasures')
            .expect(200);
        });
        it('Status 200: should return an array of treasures', () => {
          return request(app)
            .get('/api/treasures')
            .expect(200)
            .then(({ body }) => {
              expect(body.treasures).to.be.an('array');
              expect(body.treasures[0]).to.be.an('object');
            });
        });
        it('Status 200: should contain necessary keys', () => {
          return request(app)
            .get('/api/treasures')
            .expect(200)
            .then(({ body }) => {
              expect(body.treasures[0]).to.contain.keys(
                'treasure_id',
                'treasure_name',
                'colour',
                'age',
                'cost_at_auction'
              );
            });
        });
        it('Status 200: should NOT have a shop_id key, and instead, a shop_name key', () => {
          return request(app)
            .get('/api/treasures')
            .expect(200)
            .then(({ body }) => {
              expect(body.treasures[0]).to.not.contain.key('shop_id');
              expect(body.treasures[0]).to.contain.key('shop_name');
            });
        });
        it('Status 200: should sort by auction cost ASC by default', () => {
          return request(app)
            .get('/api/treasures')
            .expect(200)
            .then(({ body }) => {
              expect(body.treasures).to.be.sortedBy('cost_at_auction');
            });
        });
        it('Status 200: should accept a user-provided sort-key', () => {
          return request(app)
            .get('/api/treasures?sort_by=age')
            .expect(200)
            .then(({ body }) => {
              expect(body.treasures).to.be.sortedBy('age');
            });
        });
        it('Status 200: should be able to pick asc or desc', () => {
          return request(app)
            .get('/api/treasures?order_by=desc')
            .expect(200)
            .then(({ body }) => {
              expect(body.treasures).to.be.sortedBy('cost_at_auction', {
                descending: true
              });
            });
        });
        describe('Error Handling', () => {
          it('Status 200: should order by ascending even when given invalid order', () => {
            return request(app)
              .get('/api/treasures?order_by=cats')
              .expect(200)
              .then(({ body }) => {
                expect(body.treasures).to.be.sortedBy('cost_at_auction');
              });
          });
          it('Status 404: should return column not found for invalid sort', () => {
            return request(app)
              .get('/api/treasures?sort_by=weight')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal('Column not found!');
              });
          });
        });
      });
      describe('POST', () => {
        const treasure = {
          treasure_name: 'Diamond',
          colour: 'Clear',
          age: 134,
          cost_at_auction: 1243.68,
          shop_id: 1
        };
        it('Status 201: should successfully connect to endpoint', () => {
          return request(app)
            .post('/api/treasures')
            .send(treasure)
            .expect(201);
        });
        it('Status 201: should return the posted object with an appended id', () => {
          return request(app)
            .post('/api/treasures')
            .send(treasure)
            .expect(201)
            .then(({ body }) => {
              expect(body.treasure).to.eql({
                treasure_id: 28,
                treasure_name: 'Diamond',
                colour: 'Clear',
                age: 134,
                cost_at_auction: '1243.68',
                shop_id: 1
              });
            });
        });
        describe('Error Handling', () => {
          it('Status 400: should reject treasure missing any values', () => {
            const missingTreasure = {
              age: 134,
              cost_at_auction: 1243.68,
              shop_id: 1
            };
            return request(app)
              .post('/api/treasures')
              .send(missingTreasure)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal('Missing required data!');
              });
          });
          it('Status 400: should reject treasure with an invalid data type', () => {
            const treasureType = {
              treasure_name: 'Diamond',
              colour: 'Clear',
              age: 'Nan',
              cost_at_auction: 1243.68,
              shop_id: 1
            };
            return request(app)
              .post('/api/treasures')
              .send(treasureType)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal('Incorrect data type!');
              });
          });
          it('Status 422: should reject treasure with invalid foreign key', () => {
            const treasureNoShop = {
              treasure_name: 'Diamond',
              colour: 'Clear',
              age: 234,
              cost_at_auction: 1243.68,
              shop_id: 18437
            };
            return request(app)
              .post('/api/treasures')
              .send(treasureNoShop)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal('Shop does not exist!');
              });
          });
        });
      });
      describe('/:id', () => {
        it('Status 405: should only allow PATCH and DELETE methods', () => {
          const notAllowed = ['get', 'post', 'put'];
          const promises = notAllowed.map(method => {
            return request(app)
              [method]('/api/treasures/2')
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal('Method not allowed!');
              });
          });
          return Promise.all(promises);
        });
        describe('PATCH', () => {
          const patchData = { cost_at_auction: 20.45 };
          it('Status 200: should successfully find an existing treasure', () => {
            return request(app)
              .patch('/api/treasures/4')
              .send(patchData)
              .expect(200);
          });
          it('Status 200: should update price of given treasure to 20.45', () => {
            return request(app)
              .patch('/api/treasures/2')
              .send(patchData)
              .expect(200)
              .then(({ body }) => {
                expect(body.treasure).to.eql({
                  treasure_id: 2,
                  treasure_name: 'treasure-d',
                  colour: 'azure',
                  age: 100,
                  cost_at_auction: '20.45',
                  shop_id: 2
                });
              });
          });
          describe('Error handling', () => {
            it('Status 400: should reject treasure patch of invalid data type', () => {
              const treasureType = {
                age: 'Nan'
              };
              return request(app)
                .patch('/api/treasures/2')
                .send(treasureType)
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal('Incorrect data type!');
                });
            });
            it('Status 400: should reject treasure patch of invalid foreign key', () => {
              const treasureType = {
                shop_id: 82437
              };
              return request(app)
                .patch('/api/treasures/2')
                .send(treasureType)
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal('Shop does not exist!');
                });
            });
            it('Status 400: should reject treasure patch of invalid key', () => {
              const treasureType = {
                weight: 294
              };
              return request(app)
                .patch('/api/treasures/2')
                .send(treasureType)
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.equal('Column not found!');
                });
            });
          });
        });
      });
    });
  });
});

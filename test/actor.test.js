require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can POST and actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({ name: 'Bruce Campbell' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Bruce Campbell',
          __v: 0
        });
      });
  });

  it('gets all the actors', async() => {
    const actors = await Actor.create([
      { name: 'Bruce Campbell' },
      { name: 'Jeff Bridges' },
      { name: 'Angelica Houston' },
    ]);

    //start here - second part of gett all actors method
    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        const actorsJSON = JSON.parse(JSON.stringify(actors));
        actorsJSON.forEach(actor => {
          expect(res.body).toContainEqual(actor);
        });
      });
  });
});

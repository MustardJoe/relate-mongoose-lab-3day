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
});

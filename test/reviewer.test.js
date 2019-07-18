require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');

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

  it('can POST a new reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({ name: 'Jon the Reviewer', company: 'JonCo' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Jon the Reviewer',
          company: 'JonCo',
          __v: 0
        });
      });
  });

  it('can get all the reviewers', async() => {
    const reviewers = await Reviewer.create([
      { name: 'jorb', company: 'jorbCo' },
      { name: 'party dood', company: 'darkstar' },
      { name: 'philosopher king', company: 'shadow'},
    ]);

    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        const reviewersJSON = JSON.parse(JSON.stringify(reviewers));
        reviewersJSON.forEach(reviewer => {
          expect(res.body).toContainEqual(reviewer);
        });
      });
  });

});

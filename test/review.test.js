require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');


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

  let studio = null;
  let actor = null;
  let reviewer = null;
  let film = null;
  beforeEach(async() => {
    actor = JSON.parse(JSON.stringify(await Actor.create({
      name: 'Bruce Campbell'
    })));

    studio = JSON.parse(JSON.stringify(await Studio.create({
      name: 'Renaissance',
    })));

    film = JSON.parse(JSON.stringify(await Film.create({
      title: 'Evil Dead 2', studio: studio._id, released: 1987, cast: [{ role: 'Ash', actor: actor._id }]
    })));

    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({
      name: 'jorb', company: 'jorbCo'
    })));
  });

  it('can POST a new review', () => {
    const testRev = {
      reviewer: reviewer._id,
      revContent: 'best movie ever',
      rating: 5,
      film: film._id,
    };

    return request(app)
      .post('/api/v1/reviews')
      .send(testRev)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          reviewer: reviewer._id,
          revContent: 'best movie ever',
          rating: 5,
          film: film._id,
          __v: 0,
        });
      });
  });

  it('can get all reviews, max length 100', async() => {
    await Promise.all([...Array(101)].map((review, i) => {
      return Review.create({
        rating: 5,
        reviewer: reviewer._id,
        revContent: `this is movie ${i}`,
        film: film._id
      });
    }));

    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body).toHaveLength(100);
      });

  });

});

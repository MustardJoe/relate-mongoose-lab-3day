require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');
const Actor = require('../lib/models/Actor');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');
const Review = require('../lib/models/Review');

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
      { name: 'philosopher king', company: 'shadow' },
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

  it('can GET a single reviewer by index numb', async() => {
    const reviewer = JSON.parse(JSON.stringify(await Reviewer.create({
      name: 'jorb', company: 'jorbCo',
    })));

    const actor = JSON.parse(JSON.stringify(await Actor.create({
      name: 'Bruce Campbell'
    })));

    const studio = JSON.parse(JSON.stringify(await Studio.create({
      name: 'Renaissance',
    })));

    const film = JSON.parse(JSON.stringify(await Film.create({
      title: 'Evil Dead 2', studio: studio._id, released: 1987, cast: [{ role: 'Ash', actor: actor._id }]
    })));

    const review = JSON.parse(JSON.stringify(await Review.create({
      reviewer: reviewer._id, film: film._id, rating: 5, revContent: 'Best Movie Ever!', 
    })));

    console.log(review.revContent);

    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer._id,
          name: 'jorb',
          company: 'jorbCo',
          reviews: [{
            _id: review._id,
            rating: review.rating,
            // revContent: review.revContent,
            film: {
              _id: film._id,
              title: film.title,
            }
          }]

        });
      });

  });

});

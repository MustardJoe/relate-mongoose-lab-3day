require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
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

  let studio = null;
  let actor = null;
  let film = null;
  beforeEach(async() => {
    actor = await Actor.create({ name: 'Anjelica Huston' });
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Touchstone Pictures' })));
    film = JSON.parse(JSON.stringify(await Film.create({
      title: 'Life Aquatic',
      studio: studio._id,
      released: '2004',
      cast: [{ role: 'Eleanor', actor: actor._id }]
    })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can POST an actor', () => {
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
      { name: 'Anjelica Huston' },
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

  it('can GET 1 actor by index numb', async() => {

    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        // console.log(film);
        const actorJSON = JSON.parse(JSON.stringify(actor));
        expect(res.body).toEqual({
          ...actorJSON, films: [film]
        });
      });
  });

  it('can update a single actor with PUT', async() => {
    return request(app)
      .put(`/api/v1/actors/${actor._id}`)
      .send({
        birthLocation: 'Santa Monica, CA'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Anjelica Huston',
          birthLocation: 'Santa Monica, CA',
          __v: 0,
        });
      });
  });
});

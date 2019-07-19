require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');
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
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Renaissance' })));
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Bruce Campbell' })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can POST a film (movie)', () => {
    return request(app)
      .post('/api/v1/films')
      .send({ title: 'Evil Dead 2', studio: studio._id, released: 1987, cast: [{ role: 'Ash', actor: actor._id }] })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'Evil Dead 2',
          // studio: 'Renaissance',
          studio: expect.any(String),
          released: 1987,
          cast: [{ _id: expect.any(String), role: 'Ash', actor: expect.any(String) }],
          __v: 0,
        });
      });

  });

  it('can GET all the films', async() => {
    const films = await Film.create([
      { title: 'Evil Dead 2', studio: studio._id, released: 1987, cast: [{ role: 'Ash', actor: actor._id }] },
      { title: 'Evil Dead 3', studio: studio._id, released: 1988, cast: [{ role: 'Ash', actor: actor._id }] },
      { title: 'Evil Dead 4', studio: studio._id, released: 1989, cast: [{ role: 'Ash', actor: actor._id }] },
    ]);

    return request(app)
      .get('/api/v1/films')
      .then(res => {
        const filmsJSON = JSON.parse(JSON.stringify(films));
        filmsJSON.forEach(film => {
          expect(res.body).toContainEqual(film);
        });
      });
  });

});

require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');

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

  it('can POST a studio with', () => {
    return request(app)
      .post('/api/v1/studios')
      .send({ name: 'Jon Studio' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Jon Studio',
          __v: 0
        });
      });
  });

  it('can get all the studios (better have at least 2 to get', async() => {
    const studios = await Studio.create([
      { name: 'jorb jab' },
      { name: 'jinny jimpjom' },
      { name: 'a studio' },
    ]);

    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        const studiosJSON = JSON.parse(JSON.stringify(studios));
        studiosJSON.forEach(studio => {
          // expect(res.body).toContainEqual({ name: studio.name, _id: studio._id });
          expect(res.body).toContainEqual(studio);
        });
      });
  });

  it('can get one(1) studio by index numb', async() => {
    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        // console.log(studio._id);
        // console.log(res.body);
        const studioJSON = JSON.parse(JSON.stringify(studio));
        expect(res.body).toEqual({
          ...studioJSON, films: [film]
        });
      });
  });
});


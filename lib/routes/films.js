const { Router } = require('express');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      title,
      studio,
      released,
      cast
    } = req.body;

    Film
      .create({ title, studio, released, cast })
      .then(dog => res.send(dog))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Film
      .find()
      .then(films => res.send(films))
      .catch(next);
  });

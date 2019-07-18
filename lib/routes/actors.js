const { Router } = require('express');
const Actor = require('../models/Actor');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { name } = req.body;

    Actor
      .create({ name })
      .then(actor => res.send(actor))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Actor
      .find()
      .then(actors => res.send(actors))
      .catch(next);
  });
const { Router } = require('express');
const Actor = require('../models/Actor');
const Film = require('../models/Film');

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
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Actor.findById(req.params.id),
      Film.find({ 'cast.actor': req.params.id })
    ])
      .then(([actor, films]) => res.send({ ...actor.toJSON(), films }))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    Actor
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedActor => res.send(updatedActor))
      .catch(next);

  });

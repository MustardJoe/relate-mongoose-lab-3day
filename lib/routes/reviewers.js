const { Router } = require('express');
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { name, company } = req.body;

    Reviewer
      .create({ name, company })
      .then(reviwer => res.send(reviwer))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Reviewer
      .find()
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Reviewer
        .findById(req.params.id)
        .select({ _id: true, name: true, company: true }),
      Review
        .find({ reviewer: req.params.id })
        .populate('film', { _id: true, title: true })
        .select({ _id: true, rating: true, film: true })
    ])
      .then(([reviewer, reviews]) => {
        res.send({ ...reviewer.toJSON(), reviews });
      })
      .catch(next);
  });

const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      reviewer,
      film,
      rating,
      revContent,
    } = req.body;

    Review
      .create(({ reviewer, film, rating, revContent }))
      .then(review => res.send(review))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Review 
      .find()
      .limit(100)
      .select({ rating: true, review: true, film: true })
      .then(reviews => res.send(reviews))
      .catch(next);
  });

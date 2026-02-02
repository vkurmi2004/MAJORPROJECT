const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware');
const reviewsController = require('../controllers/reviews');

// ADD REVIEW
router.post('/', isLoggedIn, reviewsController.addReview);

// DELETE REVIEW
router.delete('/:reviewId', isLoggedIn, reviewsController.deleteReview);

module.exports = router;

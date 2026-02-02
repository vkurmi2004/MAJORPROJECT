const express = require('express');
const router = express.Router();

const listingsController = require('../controllers/listings');
const { isLoggedIn } = require('../middleware');

// INDEX
router.get('/', listingsController.index);

// NEW
router.get('/new', isLoggedIn, listingsController.renderNewForm);

// CREATE
router.post('/', isLoggedIn, listingsController.createListing);

// SHOW
router.get('/:id', listingsController.showListing);

// EDIT
router.get('/:id/edit', isLoggedIn, listingsController.renderEditForm);

// UPDATE
router.put('/:id', isLoggedIn, listingsController.updateListing);

// DELETE
router.delete('/:id', isLoggedIn, listingsController.deleteListing);

module.exports = router;

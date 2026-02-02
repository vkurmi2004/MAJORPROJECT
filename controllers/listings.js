const NodeGeocoder = require('node-geocoder');
const Listing = require('../models/listing');
const Review = require('../models/review');

const geoOptions = {
  provider: 'openstreetmap'
};

const geocoder = NodeGeocoder(geoOptions);

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render('listings/index', { listings });
};

module.exports.renderNewForm = (req, res) => {
  res.render('listings/new');
};

module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: { path: 'author' }
    })
    .populate('owner');

  if (!listing) {
    req.flash('error', 'Listing not found!');
    return res.redirect('/listings');
  }

  res.render('listings/show', { listing });
};

module.exports.createListing = async (req, res) => {
  const listing = new Listing(req.body.listing);

  // Geocode location using OpenStreetMap
  const geoData = await geocoder.geocode(
    `${req.body.listing.location}, ${req.body.listing.country}`
  );

  // If geocode found results, save coordinates
  if (geoData && geoData.length > 0) {
    listing.geometry = {
      type: 'Point',
      coordinates: [geoData[0].longitude, geoData[0].latitude]
    };
  } else {
    // Fallback location (Delhi) if geocode fails
    listing.geometry = {
      type: 'Point',
      coordinates: [77.2090, 28.6139]
    };
  }

  // Owner must exist (ensure user is logged in)
  listing.owner = req.user._id;

  await listing.save();

  req.flash('success', 'New listing created!');
  res.redirect(`/listings/${listing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render('listings/edit', { listing });
};

module.exports.updateListing = async (req, res) => {
  await Listing.findByIdAndUpdate(
    req.params.id,
    req.body.listing,
    { runValidators: true }
  );

  req.flash('success', 'Listing updated!');
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteListing = async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);

  await Review.deleteMany({
    _id: { $in: listing.reviews }
  });

  req.flash('success', 'Listing deleted!');
  res.redirect('/listings');
};

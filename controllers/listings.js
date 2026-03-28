const NodeGeocoder = require('node-geocoder');
const Listing = require('../models/listing');
const Review = require('../models/review');

const geoOptions = {
  provider: 'openstreetmap'
};

const geocoder = NodeGeocoder(geoOptions);

module.exports.index = async (req, res) => {
  const { q } = req.query;
  let filter = {};

  if (q && q.trim().length > 0) {
    const searchRegex = new RegExp(q.trim(), 'i'); // Case-insensitive fuzzy search
    filter = {
      $or: [
        { title: searchRegex },
        { location: searchRegex },
        { country: searchRegex }
      ]
    };
  }

  const listings = await Listing.find(filter);
  res.render('listings/index', { listings, q });
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
  const listingData = req.body.listing;
  const listing = new Listing(listingData);

  // Manual fix for image object if input was a string
  if (typeof listingData.image === 'string' && listingData.image.length > 0) {
    listing.image = { url: listingData.image };
  } else if (!listingData.image || !listingData.image.url) {
    // Default image if none provided
    listing.image = { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' };
  }

  // Geocode location using OpenStreetMap
  try {
    const geoData = await geocoder.geocode(`${listing.location}, ${listing.country}`);
    if (geoData && geoData.length > 0) {
      listing.geometry = {
        type: 'Point',
        coordinates: [geoData[0].longitude, geoData[0].latitude]
      };
    } else {
      listing.geometry = { type: 'Point', coordinates: [77.2090, 28.6139] };
    }
  } catch (err) {
    listing.geometry = { type: 'Point', coordinates: [77.2090, 28.6139] };
  }

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
  const listingData = req.body.listing;
  
  // If image URL was provided as a string, map it correctly
  if (typeof listingData.image === 'string' && listingData.image.length > 0) {
    listingData.image = { url: listingData.image };
  }

  await Listing.findByIdAndUpdate(
    req.params.id,
    listingData,
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

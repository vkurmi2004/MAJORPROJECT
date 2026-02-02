const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  location: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  image: {
    filename: String,
    url: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    },
  },

  //  REAL GEOMETRY (NO DEFAULT FAKE LOCATION)
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [lng, lat]
    },
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

//  CASCADE DELETE REVIEWS
ListingSchema.post('findOneAndDelete', async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model('Listing', ListingSchema);
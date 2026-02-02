const mongoose = require('mongoose');
const NodeGeocoder = require('node-geocoder');
const Listing = require('../models/listing');

const geoOptions = { provider: 'openstreetmap' };
const geocoder = NodeGeocoder(geoOptions);

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
  await mongoose.connect(MONGO_URL);

  const listings = await Listing.find({});

  for (let listing of listings) {
    const address = `${listing.location}, ${listing.country}`;

    const geoData = await geocoder.geocode(address);

    if (geoData && geoData.length > 0) {
      listing.geometry = {
        type: 'Point',
        coordinates: [geoData[0].longitude, geoData[0].latitude]
      };
      await listing.save();
      console.log(`Updated: ${listing.title} → ${address}`);
    } else {
      console.log(`FAILED: ${listing.title} → ${address}`);
    }
  }

  mongoose.connection.close();
}

main();

const mongoose = require('mongoose');
const data = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB', err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    // Clear existing listings
    await Listing.deleteMany({});

    // Add owner to each listing
    const listingsWithOwner = data.data.map((obj) => ({
      ...obj,
      owner: "65f0a1b2c3d4e5f678901234" // MUST exist in Users collection
    }));

    // Insert into DB
    await Listing.insertMany(listingsWithOwner);

    console.log('✅ Database initialized successfully!');
  } catch (err) {
    console.error('❌ Error initializing database:', err);
  } finally {
    mongoose.connection.close();
  }
};

initDB();

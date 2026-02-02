const Listing = require('./models/listing');

// LOGIN CHECK
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be logged in!');
    return res.redirect('/login');
  }
  next();
};

// SAVE REDIRECT URL
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// LISTING OWNER AUTHORIZATION
module.exports.isListingOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash('error', 'Listing not found!');
    return res.redirect('/listings');
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash('error', 'You are not authorized!');
    return res.redirect(`/listings/${id}`);
  }

  next();
};

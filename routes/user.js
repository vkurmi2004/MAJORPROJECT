const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');  
const controllers = require('../controllers/users.js');
const user = require('../models/user.js');


// SIGNUP FORM
router.get('/signup', (controllers.renderSignupForm));

// SIGNUP POST
router.post('/signup',
    wrapAsync(controllers.signup)
);


// LOGIN FORM
router.get('/login', saveRedirectUrl,controllers.renderLoginForm);

router.post('/login',
    saveRedirectUrl,
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
  }),
 controllers.login
);


router.get('/logout', ( controllers.logout ));

module.exports = router;

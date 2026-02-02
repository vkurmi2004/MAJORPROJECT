const User = require('../models/user');

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
};
module.exports.signup = async (req, res, next) => {
        try {
            const { username, email, password } = req.body;

            const newUser = new User({ username, email });
            const registeredUser = await User.register(newUser, password);

            req.login(registeredUser, err => {
                if (err) return next(err);
                req.flash('success', '✅ Welcome to Wanderlust!');
                res.redirect('/listings');
            });

        } catch (err) {
            if (err.name === 'UserExistsError') {
                req.flash('error', '❌ Username already exists. Please choose another one.');
                return res.redirect('/signup');
            }
            next(err); // for any other error
        }
    }

    module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
}
module.exports.login = async (req, res) => {
    req.flash('success', '✅ Welcome back!');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
  }

  module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', '✅ You have logged out successfully.');
        res.redirect('/listings');
    });
}
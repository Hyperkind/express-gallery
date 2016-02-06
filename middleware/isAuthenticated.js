// if user is not authenticated, redirects to login page,
// if user is authenticated, allows to continue
module.exports = function isAuthenticated (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  return next();
};
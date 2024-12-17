function isAuthenticated(req, res, next) {
    if (req.session.user) {
        req.user = req.session.user; // Attach session user to req.user
        return next();
    }
    res.redirect('/login');
}

module.exports = { isAuthenticated };

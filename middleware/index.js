function isAuthenticated(req, res, next) {
    if (req.session.user) {
        req.user = req.session.user; // Attach session user to req.user
        return next();
    }
    res.redirect('/login');
}

// Middleware สำหรับตั้งค่า global user
function setUserLocals(req, res, next) {
    res.locals.user = req.session?.user || null; // กำหนด user ใน res.locals
    next();
}

module.exports = { isAuthenticated, setUserLocals };

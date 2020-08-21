module.exports = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        if (req.query.retUrl)
            retUrl = req.query.retUrl;
        else retUrl = req.originalUrl;
        return res.redirect(`/login?retUrl=${retUrl}`);
    }
    next();
}
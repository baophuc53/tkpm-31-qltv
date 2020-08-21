theloaiModel = require('../models/theloai.model')

module.exports = async(req, res, next) => {
    if (req.session.isAuthenticated)
        res.locals.isAuthenticated = true;
    else res.locals.isAuthenticated = false;
    res.locals.theloai = await theloaiModel.all();
    next();
}
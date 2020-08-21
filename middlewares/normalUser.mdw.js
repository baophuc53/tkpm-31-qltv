module.exports = (req, res, next) => {
    if (req.session.authUser.Status != 3) {
        console.log(req.session.authUser)
        return res.redirect('/');
    }
    next();
}
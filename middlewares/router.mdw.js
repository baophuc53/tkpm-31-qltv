var homeRouter = require('../routes/home.route')
var loginRouter = require('../routes/login.route')
var profileRouter = require('../routes/profile.route')
var Theloai = require('../routes/theloai.route')
var detailRouter = require('../routes/detail.route')
var Admin = require('../routes/admin.route')
var postSachRouter = require('../routes/postSach.route')

const auth = require('../middlewares/auth.mdw')
const lstheloai = require('../middlewares/locals.mdw')
const authAdmin = require('../middlewares/normalUser.mdw')

module.exports = app => {

    app.use('/', lstheloai, homeRouter);
    app.use('/detail', lstheloai, detailRouter);
    app.use('/login', loginRouter);
    app.use('/Theloai', lstheloai, Theloai);
    app.use('/profile', auth, lstheloai, profileRouter);
    app.use('/postSach', auth, lstheloai, postSachRouter);
    app.use('/admin', auth, authAdmin, Admin);
}
var express = require('express');
const moment = require('moment');
var bcrypt = require('bcryptjs');
const userModel = require('../models/nguoidung.model');
var router = express.Router();


router.get('/', async(req, res) => {
    user = req.session.authUser;
    date = moment(user.Date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    isSeller = (user.Status == 0);
    if (req.query.error)
        err_message = "SignUp failed!";

    console.log(req.session.authUser)
    res.render('profile', {
        title: 'Thông tin cá nhân',
        user,
        date,
        isSeller
    });
});


router.post('/', async(req, res) => {

    const user = await userModel.singleByUserName(req.session.authUser.Username);
    const dob = moment(user.Date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    if (user === null) {
        return res.redirect('?error=true');
    }
    if (req.body.NewPassword !== req.body.ConfirmPassword) {
        return res.redirect('/profile');
    }

    const rs = bcrypt.compareSync(req.body.OldPassword, user.Password);
    if (rs === false) {
        return res.redirect({
            err_message: 'Mật khẩu cũ không đúng',
        });
    }

    req.session.authUser.Date = entity.Date;
    req.session.authUser.Name = entity.Name;
    req.session.authUser.Email = entity.Email;
    req.session.authUser.Phone = entity.Phone;
    req.session.authUser.Address = entity.Address;
    const rd = bcrypt.compareSync(req.body.NewPassword, user.Password);
    if (rd === true) {
        return res.redirect('/profile');
    }
    const entity = req.body;
    entity.Password = bcrypt.hashSync(entity.NewPassword, 10);
    entity.Username = req.session.authUser.Username;
    entity.Date = moment(req.body.Date, 'MM/DD/YYYY').format('YYYY-MM-DD');
    delete entity.OldPassword;
    delete entity.NewPassword;
    delete entity.ConfirmPassword;

    const result = await userModel.patch(entity);
    res.redirect('/');
})

router.get('/upgrade', async(req, res) => {
    user = req.session.authUser;
    user.Date = new Date(user.Date)
    user.Status = 2;
    await userModel.patch(user);
    res.send('Success')
})

module.exports = router;
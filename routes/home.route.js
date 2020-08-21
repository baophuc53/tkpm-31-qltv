var express = require('express');
const sachModel = require('../models/sach.model');
const config = require('../config/default.json');
var router = express.Router();

/* GET home page. */
router.get('/', async(req, res) => {

    res.render('home', {
        title: 'Sàn đấu giá',
        nearFinish:[{
           Tensach: "aaaa",
           Tacgia: "sàdf",
           Namxuatban: "ádfd",
           Nhaxuatban: "ádfsadfa",
        }],
    });
});

router.get('/logout', (req, res) => {
    req.session.isAuthenticated = false;
    if (req.session.authUser.Username)
        delete req.session.authUser.Username;
    res.redirect('/login');
})

router.get('/search', async(req, res) => {

    const limit = config.paginate.limit
    const page = req.query.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;
    [sachs, total] = await Promise.all(
        [
            sachModel.search(req.query.searchKey, offset),
            sachModel.countBySearch(req.query.searchKey)
        ]
    )

    if (req.session.isAuthenticated)
        sachs.forEach(j => {
           
        });
    nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrentPage: i === +page
        })
    }
    res.render('sach', {
        title: 'Result ' + req.query.searchKey,
        sachs,
        empty: sachs.length === 0,
        page_numbers,
        prev_value: +page - 1,
        next_value: +page + 1,
    })
})
module.exports = router;
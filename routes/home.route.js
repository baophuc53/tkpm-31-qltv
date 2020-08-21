var express = require('express');
const bookModel = require('../models/book.model');
const config = require('../config/default.json');
var router = express.Router();

/* GET home page. */
router.get('/', async(req, res) => {

    res.render('home', {
        title: 'Sàn đấu giá',
        nearFinish:[{
           name: "aaaa",
           author: "sàdf",
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
    [book, total] = await Promise.all(
        [
            bookModel.search(req.query.searchKey, offset),
            bookModel.countBySearch(req.query.searchKey)
        ]
    )

    if (req.session.isAuthenticated)
        book.forEach(j => {
           
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
    res.render('book', {
        title: 'Result ' + req.query.searchKey,
        book,
        empty: book.length === 0,
        page_numbers,
        prev_value: +page - 1,
        next_value: +page + 1,
    })
})
module.exports = router;
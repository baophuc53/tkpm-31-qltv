var express = require('express');
const bookModel = require('../models/book.model');
const config = require('../config/default.json');
const authMdw = require('../middlewares/auth.mdw');
const userModel = require('../models/user.model');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
    const limit = config.paginate.limit;

    const page = req.query.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;

    const [total, rows] = await Promise.all([
        bookModel.count(),
        bookModel.allByPage(offset)
    ]);

    // const total = await bookModel.countByCat(id);
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrentPage: i === +page
        })
    }


    res.render('home', {
        title: 'Thư viện online',
        book: rows,
        empty: rows.length === 0,
        page_numbers,
        curr_value: +page,
        prev_value: +page - 1,
        next_value: +page + 1,
    });
});

router.get('/change-pass', authMdw, async (req, res) => {
    res.render('changepass')
})
router.post('/change-pass', authMdw, async (req, res) => {
    if (req.body.new_password != req.body.confirm_password) {
        res.render('changepass', {
            err: "Mật khẩu xác nhận không trùng khớp"
        })
        return
    }
    const acc = await userModel.single(req.session.username)
    if (acc.password != req.body.password){
        res.render('changepass', {
            err: "Sai mật khẩu"
        })
        return
    }
    acc.password = req.body.new_password
    await userModel.patch(acc)
    res.render("success", {
        retUrl: '/'
    })
})
router.get('/logout', authMdw, (req, res) => {
    req.session.isAuthenticated=false;
    delete req.session.role

    res.redirect('/login');
})

router.get('/search', async (req, res) => {

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
const express = require('express');
const controller = require('../controller/category.controller')
const router = express.Router();

//
// xem ds sản phẩm thuộc danh mục :id

router.get('/:name/book/', async(req, res) => {
    controller.showbookByCat(req, res);
})

module.exports = router;
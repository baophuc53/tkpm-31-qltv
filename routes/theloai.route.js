const express = require('express');
const controller = require('../controller/theloai.controller')
const router = express.Router();

//
// xem ds sản phẩm thuộc danh mục :id

router.get('/:name/sachs/', async(req, res) => {
    controller.showSachByCat(req, res);
})

module.exports = router;
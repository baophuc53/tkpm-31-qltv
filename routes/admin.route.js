var express = require('express');
var nodemailer = require('nodemailer');
const userModel = require('../models/nguoidung.model');
const categoryModel = require('../models/category.model');
var router = express.Router();

router.get('/nguoidung', async(req, res) => {
    const list = await userModel.all();
    list.forEach(element => {
        switch (element.Status) {
            case 0:
                element.UserMode = 'Bidder';
                break;
            case 1:
                element.UserMode = 'Seller';
                break;
            case 2:
                element.UserMode = 'Waiting';
                break;
            case 3:
                element.UserMode = 'Admin';
                break;
            default:
                element.UserMode = 'Error';

        }
    });
    res.render('admin_users', {
        title: 'Admin',
        users: list
    });
});

router.get('/danhmuc', async(req, res) => {
    const list = await userModel.all();
    res.render('admin_category', {
        title: 'Admin',
        users: list
    });
});

router.get('/danhmuc/them', (req, res) => {
    res.render('add_category', {
        title: 'Thêm danh mục'
    });
});

router.post('/danhmuc/them', async(req, res) => {
    const entity = {
        name: req.body.name,
    }
    const result = await categoryModel.add(entity);
    console.log(result);
    res.render('add_category', {
        title: 'Thêm danh mục'
    });
});

router.get('/danhmuc/edit/:id', async(req, res) => {
    const rows = await categoryModel.single(req.params.id);
    res.render('edit_category', {
        title: 'Sửa danh mục',
        category: rows
    });
});

router.post('/danhmuc/patch', async(req, res) => {
    const result = await categoryModel.patch(req.body);
    res.redirect('/admin/danhmuc');
});

router.post('/danhmuc/del', async(req, res) => {
    const result = await categoryModel.del(req.body.id);
    res.redirect('/admin/danhmuc');
});

router.get('/', async(req, res) => {
    const list = await userModel.allWaiting();
    res.render('admin_upgrade', {
        title: 'Admin',
        users: list
    });
});

router.get('/:username/accept', async(req, res) => {
    const result = await userModel.waitingToSeller(req.params.username);
    res.redirect('/admin/');
});

router.get('/:username/delete', async(req, res) => {
    const result = await userModel.waitingToBidder(req.params.username);
    res.redirect('/admin/');
});

module.exports = router;
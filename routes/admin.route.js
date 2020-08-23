const express = require("express");
const categoryModel = require("../models/category.model");
const userModel = require("../models/user.model");
const paramsModel = require("../models/params.model");
const router = express.Router();

router.get('/', async(req, res) => {
    const list = await userModel.all();
    res.render('admin_users', {
        title: 'Admin',
        users: list
    });
});

router.get("/user", async (req, res) => {
    const list = await userModel.all();
    res.render("admin_users", {
        title: "Admin",
        users: list
    });
})

router.get("/params", async (req, res) => {
    const list = await paramsModel.all();
    res.render("admin_params", {
        title: "Admin",
        params: list
    });
})

router.get("/category", async (req, res) => {
    const list = await categoryModel.all();
    res.render("admin_categories", {
        title: "Admin",
        category: list
    });
})

router.get("/category/add", async (req, res) => {
    const list = await categoryModel.all();
    res.render("add_categories", {
        title: "Admin"
    });
})

router.post('/category/add', async(req, res) => {
    console.log(req.body);
    const entity = {
        name: req.body.CatName,
    }
    const result = await categoryModel.add(entity);
    console.log(result);
    res.render('add_categories', {
        title: 'Thêm danh mục'
    });
});

router.get("/category/edit/:id", async (req, res) => {
    const rows = await categoryModel.single(req.params.id);
    res.render('edit_categories', {
        title: 'Sửa danh mục',
        category: rows
    });
});

router.post('/category/patch', async(req, res) => {
    const result = await categoryModel.patch(req.body);
    res.redirect('/admin/category');
});

router.post('/category/del', async(req, res) => {
    const result = await categoryModel.del(req.body.id);
    res.redirect('/admin/category');
});


module.exports = router;
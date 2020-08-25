const express = require("express");
const categoryModel = require("../models/category.model");
const userModel = require("../models/user.model");
const paramsModel = require("../models/params.model");
const createHttpError = require("http-errors");
const router = express.Router();
router.use((req,res,next)=>{
    if(req.session.role!='quản lý')
        next(createHttpError('Permission denied'))
    else next()
});

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

router.get("/param", async (req, res) => {
    const list = await paramsModel.all();
    res.render("admin_params", {
        title: "Admin",
        params: list
    });
})

router.get("/param/edit/:id",async(req,res)=>{
    const rows = await paramsModel.single(req.params.id);
    res.render('edit_param', {
        title: 'Sửa quy định',
        param: rows
    });
})

router.post("/param/edit/:id",async(req,res)=>{
    const value=req.body.value;
    await paramsModel.patch({id:req.params.id,value})
    res.redirect("/admin/param")
})

router.get("/category", async (req, res) => {
    const list = await categoryModel.all();
    res.render("admin_categories", {
        title: "Admin",
        category: list
    });
})

router.get("/category/add", async (req, res) => {
    res.render("add_categories", {
        title: "Admin"
    });
})

router.post('/category/add', async(req, res) => {
    const entity = {
        name: req.body.CatName,
    }
    const result = await categoryModel.add(entity);
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

router.post('/category/edit', async(req, res) => {
    const result = await categoryModel.patch(req.body);
    res.redirect('/admin/category');
});

router.get("/user/add", async (req, res) => {
    res.render("add_user", {
        title: "Admin"
    });
})

router.post('/user/add', async(req, res) => {
    const user=req.body
    user.password="12345678"
    await userModel.add(user);
    res.redirect("/admin/user")
});

router.get("/user/edit/:id", async (req, res) => {
    const rows = await userModel.single(req.params.id);
    res.render('edit_user', {
        title: 'Sửa thông tin người dùng',
        user: rows
    });
});

router.post('/user/edit/:id', async(req, res) => {
    const user=req.body
    user.id=req.params.id
    await userModel.patch(user);
    res.redirect('/admin/user');
});


module.exports = router;
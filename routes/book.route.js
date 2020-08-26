const express = require("express");
const bookModel = require("../models/book.model");
const router = express.Router();
const multiparty = require("multiparty");
const fs = require("fs");
const authMdw = require("../middlewares/auth.mdw");


router.get("/search", async (req, res) => {
  param = req.query.searchKey
  const book = await bookModel.search(param)
  res.render("booklist", {
    book,
  });
});
router.get("/id/:id", async (req, res) => {
  const book = await bookModel.single(req.params.id);
  if (book) {
    if (book.status == "còn") {
      res.json(book);
      return;
    }
  }
  res.send("Sách " + (book ? book.status : "Không tìm thấy"));
});


router.use(authMdw);
router.use((req, res, next) => {
  if (req.session.role == 'thủ thư')
    next(createHttpError('Permission denied'))
  else next()
})
router.get("/add", async (req, res) => {
  res.render("addBook");
});


router.post("/", async (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, async (err, data, file) => {
    if (err != null) {
      res.render("error");
      return;
    }

    for (const key in data) {
      data[key] = data[key][0];
    }
    data.publish_at = +data.publish_at;

    const { insertId: id } = await bookModel.add(data);
    fs.rename(file.img[0].path, `public/images/book/${id}.jpg`, async (err) => {
      if (err != null) {
        await bookModel.del({ id });
        res.render("error");
        return;
      }
      await bookModel.patch({
        id: id,
        img: `/images/book/${id}.jpg`,
      });
      res.render("success", {
        retUrl: "/book/add",
      });
    });
  });
});


module.exports = router;

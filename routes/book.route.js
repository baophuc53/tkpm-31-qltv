const express = require("express");
const bookModel = require("../models/book.model");
const router = express.Router();
const multiparty = require("multiparty");
const fs = require("fs");

//
// xem ds sản phẩm thuộc danh mục :id

router.get("/add", async (req, res) => {
  res.render("addBook");
});

router.get("/id/:id", async (req, res) => {
  const book = await bookModel.single(req.params.id);
  if (book) {
    if (book.status == "còn") {
      res.json(book);
      return;
    }
  }
  res.send("Sách " + (book ? book.status:"Không tìm thấy"));
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
        console.log(err);
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

router.get("/search", async (req, res) => {
  res.render("booklist", {
    book: [],
  });
});

module.exports = router;

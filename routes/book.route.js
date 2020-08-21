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

router.post("/", async (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, async (err, data, file) => {
    if (err != null) {
      res.render("message", {
        message: "Failed",
      });
      return;
    }

    for (const key in data) {
      data[key] = data[key][0];
    }
    data.publish_at = +data.publish_at;
    console.log(data);

    const { insertId: id } = await bookModel.add(data);

    fs.writeFile(`public/images/book/${id}.jpg`, file.img[0], async (err) => {
      if (err != null) {
        await bookModel.del({ id });
        console.log(err);
        res.render("message", {
          message: "Failed",
        });
        return;
      } else {
        await bookModel.patch({
          id: id,
          img: `/public/images/book/${id}.jpg`,
        });
        res.render("message", {
          message: "Success",
        });
      }
    });
  });
});

module.exports = router;

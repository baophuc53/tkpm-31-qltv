const express = require("express");
const bookModel=require('../models/book.model')
const router = express.Router();
const multiparty = require("multiparty");
const fs = require('fs');

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
        data[key]=data[key][0]
    }

    const id=await bookModel.add(data);


    fs.writeFile(`/public/images/book/${id}`,file.img[0])
    await bookModel.patch({
        Masach:id,
        img:`/public/images/book/${id}`
    })
    res.render("message", {
      message: "Success",
    });
  });
});

module.exports = router;

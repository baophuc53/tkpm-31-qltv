const express = require("express");
const borrowModel = require("../models/borrow.model");
const bookModel = require("../models/book.model");
const paramsModel = require("../models/params.model");
const moment = require("moment");
const router = express.Router();

router.get("/", async (req, res) => {
  const borrow = await borrowModel.allWithReaderName();
  res.render("borrow", {
    borrow,
  });
});

router.get("/edit/:id", async (req, res) => {
  const borrow = await borrowModel.singleWithReaderName(req.params.id);
  const borrow_book = await borrowModel.borrowBooksById(req.params.id);
  const timeout = await paramsModel.loadParam("Hạn trả sách");
  const feePerDay = await paramsModel.loadParam("Tiền quá hạn");
  const day = moment().diff(borrow.create_at,'day');
  var fee;
  if (day > +timeout.value)
    fee = (day-timeout.value)*(+feePerDay.value);
  else 
    fee = 0;
    console.log(fee);
  if (borrow.status === "Đang mượn") borrow.canReturn = true
  res.render("editBorrow", {
    borrow,
    borrow_book,
    fee
  });
});

router.post("/edit", async (req, res) => {
  const reader = req.body;
  await readerModel.patch(reader);
  res.redirect("/borrow");
});

router.get("/add", (req, res) => {
  res.render("addBorrow");
});

router.post("/add", async (req, res) => {
  const reader = req.body;
  await readerModel.add(reader);
  res.redirect("/reader");
});

router.post("/return/:id",  async (req, res) => {
    console.log(req.body)
    const borrow={};
    borrow.id=req.params.id
    borrow.return_at = new Date();
    borrow.status = "Đã trả";
    await borrowModel.patch(borrow);
    const borrow_book = await borrowModel.borrowBooksById(req.params.id);
    borrow_book.forEach(async e=>{
        if(req.body[e.id.toString()])
            await bookModel.patch({id:e.id,status:"còn"})
        else
            await bookModel.patch({id:e.id,status:"mất"});
    });
    
})
module.exports = router;

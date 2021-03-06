const express = require("express");
const readerModel = require("../models/reader.model");
const router = express.Router();


router.use((req, res, next) => {
  if (req.session.role == 'thủ kho')
    next(createHttpError('Permission denied'))
  else next()
})
router.get("/", async (req, res) => {
  const reader = await readerModel.all();
  res.render("reader", {
    reader,
  });
});

router.get("/edit/:id", async (req, res) => {
  const reader = await readerModel.single(req.params.id);
  res.render("editReader", {
    reader,
  });
});

router.post("/edit", async (req, res) => {
  const reader = req.body;
  await readerModel.patch(reader);
  res.redirect("/reader");
});

router.get("/add", (req, res) => {
  res.render("addReader");
});

router.post("/add", async (req, res) => {
  const reader = req.body;
  await readerModel.add(reader);
  res.redirect("/reader");
});

router.get("/email/:email", async (req, res) => {
  const reader = await readerModel.single(req.params.email);
  if (reader) {
    res.json(reader);
    return;
  }
  res.send("not found");
});
module.exports = router;

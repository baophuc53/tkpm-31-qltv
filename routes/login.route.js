const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");
router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", async (req, res) => {
  const user = await userModel.single(req.body.username);
  if (user && user.password === req.body.password) {
      req.session.isAuthenticated=true;
      req.session.username=user.username;
      req.session.role=user.role;
    res.redirect(req.query.retUrl||"/");
    return;
  }
  res.render("login",{
    err_message:"Fail to login"
  });
});

module.exports = router;

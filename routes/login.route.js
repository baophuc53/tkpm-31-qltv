const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");
router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const user = await userModel.single(req.body.username);
  if (user && user.password === req.body.password) {
      req.session.isAuthenticated=true;
      req.session.Username=req.username;
      req.session.role=user.role;
    res.redirect("/");
    return;
  }
  res.render("login",{
    err_message:"Fail to login"
  });
});

module.exports = router;

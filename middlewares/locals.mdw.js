categoryModel = require("../models/category.model");

module.exports = async (req, res, next) => {
  if (req.session.isAuthenticated) {
    res.locals.isAuthenticated = true;
    res.locals.role = req.session.role;
  } else res.locals.isAuthenticated = false;
  res.locals.category = await categoryModel.all();
  next();
};

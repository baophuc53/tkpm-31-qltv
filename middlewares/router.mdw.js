const homeRouter = require("../routes/home.route");
const loginRouter = require("../routes/login.route");
const profileRouter = require("../routes/profile.route");
const category = require("../routes/category.route");
const detailRouter = require("../routes/detail.route");
const Admin = require("../routes/admin.route");
const postbookRouter = require("../routes/postbook.route");
const book = require("../routes/book.route");
const auth = require("../middlewares/auth.mdw");
const lscategory = require("../middlewares/locals.mdw");
const authAdmin = require("../middlewares/normalUser.mdw");

module.exports = (app) => {
  app.use("/", lscategory, homeRouter);
  app.use("/book", book);
  app.use("/detail", lscategory, detailRouter);
  app.use("/login", loginRouter);
  app.use("/category", lscategory, category);
  app.use("/profile", auth, lscategory, profileRouter);
  app.use("/postbook", auth, lscategory, postbookRouter);
  app.use("/admin", auth, authAdmin, Admin);
};

const homeRouter = require("../routes/home.route");
const book = require("../routes/book.route");
const lscategory = require("../middlewares/locals.mdw");
const authMdw = require("./auth.mdw");

module.exports = (app) => {
  app.use("/", lscategory, homeRouter);
  app.use("/book",lscategory, book);
  app.use("/category",lscategory,require("../routes/category.route"))
  app.use("/login", require("../routes/login.route"));
  app.use("/reader",authMdw, lscategory, require("../routes/reader.route"));
  app.use("/borrow",authMdw, lscategory, require("../routes/borrow.route"));
  app.use("/admin",authMdw, lscategory, require("../routes/admin.route"));
};

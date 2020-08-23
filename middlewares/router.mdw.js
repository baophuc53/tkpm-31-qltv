const homeRouter = require("../routes/home.route");
const book = require("../routes/book.route");
const lscategory = require("../middlewares/locals.mdw");

module.exports = (app) => {
  app.use("/", lscategory, homeRouter);
  app.use("/book",lscategory, book);
  app.use("/login", require("../routes/login.route"));
  app.use("/reader", lscategory, require("../routes/reader.route"));
  app.use("/borrow", lscategory, require("../routes/borrow.route"));
  app.use("/admin", lscategory, require("../routes/admin.route"));
};

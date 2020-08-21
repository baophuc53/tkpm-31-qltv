const homeRouter = require("../routes/home.route");
const book = require("../routes/book.route");
const lscategory = require("../middlewares/locals.mdw");

module.exports = (app) => {
  app.use("/", lscategory, homeRouter);
  app.use("/book", book);
};

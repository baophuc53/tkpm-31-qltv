const homeRouter = require("../routes/home.route");
const loginRouter = require("../routes/login.route");
const profileRouter = require("../routes/profile.route");
const Theloai = require("../routes/theloai.route");
const detailRouter = require("../routes/detail.route");
const Admin = require("../routes/admin.route");
const postSachRouter = require("../routes/postSach.route");
const book = require("../routes/book.route");
const auth = require("../middlewares/auth.mdw");
const lstheloai = require("../middlewares/locals.mdw");
const authAdmin = require("../middlewares/normalUser.mdw");

module.exports = (app) => {
  app.use("/", lstheloai, homeRouter);
  app.use("/book", book);
  app.use("/detail", lstheloai, detailRouter);
  app.use("/login", loginRouter);
  app.use("/Theloai", lstheloai, Theloai);
  app.use("/profile", auth, lstheloai, profileRouter);
  app.use("/postSach", auth, lstheloai, postSachRouter);
  app.use("/admin", auth, authAdmin, Admin);
};

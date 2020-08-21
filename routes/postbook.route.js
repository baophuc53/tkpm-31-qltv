var express = require('express');
const bookModel = require('../models/book.model');
const categoryModel = require('../models/category.model');
const controller = require('../controller/postbook.controller')
const multer = require('multer');
var i = 0;
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    if (i === 0) file.originalname = 'main.jpg';
    else file.originalname = `${i}.jpg`;
    i++;
    cb(null, file.originalname)
  },
  destination: async (req, file, cb) => {
    const id = (await bookModel.getMaxId()).ID;
    var fs = require('fs');
    var dir = `./public/images/book/${id}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, `./public/images/book/${id}`);
  },
});
const upload = multer({ storage });
var router = express.Router();
router.get('/', function (req, res, next) {
    if(req.session.authUser)
    if (req.session.authUser.Status != 1)
        return res.redirect('/');
  res.render('postbook', {
    title: 'Đăng sản phẩm',
    err_message,
  });
});

router.post('/', upload.array('fuMain', 4), async (req, res) => {
  i = 0;

  if (req.body.Name.length === 0 || req.body.Price.length === 0 || req.body.StepPrice.length === 0 ||
    req.body.InstancePrice.length === 0 || req.body.Description.length === 0 || req.files.length === 0) {
    return res.render('postbook', {
      title: 'Đăng sản phẩm',
      err_message: 'Vui lòng điền đầy đủ thông tin.'
    });
  }
  if (req.files.length < 3) {
    return res.render('postbook', {
      title: 'Đăng sản phẩm',
      err_message: 'Sản phẩm cần 3 ảnh minh hoạ'
    });
  }
  controller.postbook(req, res);
  upload.single('fuMain')(req, res, err => {
    if (err) { }
    res.redirect('/');
  });

})

module.exports = router;
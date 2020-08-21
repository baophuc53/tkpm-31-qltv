const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');


const categoryModel = require('./models/category.model')
const middleware = require('./middlewares/router.mdw');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(session({ secret: "0" }))

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: __dirname + '/views/layouts/main.hbs',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: require('./config/handlebars-helper'),
}));

app.set('view engine', 'hbs');

middleware(app);
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });

// // error handler
// app.use(async(err, req, res, next) => {
//     if (!res.locals.lscategory)
//         res.locals.lscategory = await categoryModel.all();
//     category = res.locals.lscategory;
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     // render the error page
//     errstatus = err.status || 500;
//     res.status(errstatus);
//     res.render('error', { category, errstatus });
// });



module.exports = app;
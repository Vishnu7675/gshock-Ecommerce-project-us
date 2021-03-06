var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs=require('express-handlebars')
var session = require('express-session')
var db = require('./config/connection')
var fileUpload=require('express-fileupload')
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/',partialsDir:__dirname+'/views/partials/'}))
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"secretKey",cookie:{maxAge: 604800000}}))
app.use(fileUpload())
db.connect((err)=>{
  if(err) console.log("Connection Error");
  else console.log("Database connected");
})
app.use( async function(req,res,next) {

  // let categoryName= await userHelper.getCategoryNames()
  // let cartCount=0
  if(req.session.user){
    // let userDetails=req.session.user
    //  cartCount=await userHelper.getCartCount(req.session.user._id)
    

     res.locals = {userLoggedIn:true}
  }
 
   next();
});
app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

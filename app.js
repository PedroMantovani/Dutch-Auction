var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const axios = require('axios')
var app = express();

// var indexRouter = require('./routes/index');
var cadastroRouter = require('./routes/cadastrovenda');
var leilaoRouter = require('./routes/leilao');


const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// app.use('/', checkAuthenticated, indexRouter);
app.get('/', function (req, res, next) {

  // res.render('index', { title: 'Leilão Holandes - Início' });

  axios.get('https://connector.sapios.com.br/v1/storages/625b2207bddba65ac91ddb44/dutch')
    .then(function (response) {
      res.render('index', { title: 'Leilão Holandes - Início', leilao: response.data });
    })
    .catch(function (error) {
      res.render('index', { title: 'Leilão Holandes - Início' });
    })

});
app.use('/cadastrovenda', checkAuthenticated, cadastroRouter);
// app.use('/cadastrovenda', cadastroRouter);
app.use('/leilao', leilaoRouter);

app.use('/lance/:id', checkAuthenticated, (req, res) => {

})


//  LOGIN E REGISTRO
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login', { title: 'Leilão Holandes - Login' })
})
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false
}))
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register', { title: 'Leilão Holandes - Login' })
})
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    console.log(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })

    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})
app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.isAuthenticated())
    return res.redirect('/')
  }
  next()
}


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// @flow

import express from 'express';
import morgan from 'morgan';
import mincer from 'mincer';
import path from 'path';
import Router from 'named-routes';
import debug from 'debug';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import sequelize from './db';
import passport from 'passport';
import configurePassport from './auth/github';
import saveFormData from './helpers/hooks';

import home from './routes/index';
import about from './routes/about';

const debugServer = debug('interview:server');
const debugError = debug('interview:error');
const app = express();

const passportGithubEnv = {
  github_client_id: process.env.GITHUB_CLIENT_ID || 'hexlet',
  github_client_secret: process.env.GITHUB_CLIENT_SECRET || 'LISP',
  github_callback: process.env.GITHUB_CALLBACK || 'http://127.0.0.1/login/callback',
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//logging setup
app.use(morgan('dev'));
mincer.logger.use(debug('interview:mincer'));

//assets pipeline setup
let environment = new mincer.Environment();
environment.enable('source_maps');
environment.enable('autoprefixer');
environment.appendPath('public/stylesheets');
environment.appendPath('public/javascripts');
environment.appendPath('node_modules');
app.use('/assets', mincer.createServer(environment));

app.use(require('express-session')({
  secret: 'LISPy cat',
  resave: true,
  saveUninitialized: true
}));

configurePassport(passportGithubEnv);
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === 'production') {
  environment.cache = new mincer.FileStore(path.join(__dirname, 'cache'));
  environment.jsCompressor = 'uglify';
  environment.cssCompressor = 'csswring';
  environment = environment.index;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//db setup
const force = process.env.NODE_ENV !== ‘production';
sequelize.sync({ force }).then(() => {
  debugServer('connected to database');
});

//routing setup
const router = new Router();
router.extendExpress(app);
router.registerAppHelpers(app);

home.registerRoutes(app);
about.registerRoutes(app);

async function saveToDb(data, reqType) {
  if (reqType === 'add-applicant') {
    debugServer('POST /add-applicant', data);
    const res = await sequelize.models.user.createApplicant(data);
    debugServer('Result', res);
  } else if (reqType === 'add-interviewer') {
    debugServer('POST /add-interviewer', data);
    const res = await sequelize.models.user.createInterviewer(data);
    debugServer('Result', res);
  }
}

app.get('/login/callback', 'callback', passport.authenticate('github', {failureRedirect: '/'}),
  (req, res) => {
    const data = req.session.initBody;
    const type = req.session.requestType;
    data.email = (req.user.emails && req.user.emails[0] && req.user.emails[0].value)
      ||
      'no public email';

    return process.nextTick(() => {
      if (data) {
        saveToDb(data, type);
      } else {
        return res.send('Something bad just happened');
      }
      return res.redirect(app.namedRoutes.build('home'));
    });
  }
);

app.post('/add-interviewer', 'add-interviewer', saveFormData, passport.authenticate('github'));
app.post('/add-applicant', 'add-applicant', saveFormData, passport.authenticate('github'));


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const errorInfo = {
    error: new Error('Not found'),
    status: 404
  };
  next(errorInfo);
});

// development error handler
// will print stacktrace
app.use(({error, status}, req, res, next) => {
  debugError(error);
  res.status(status || 500);
  res.render('error', {
    message: error.message,
    status: status,
    error: error
  });
});


// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
  app.use(({error, status}, req, res, next) => {
    debugError(error);
    res.status(status || 500);
    res.render('error', {
      message: error.message,
      status: status,
      error: {}
    });
  });
}
module.exports = app;

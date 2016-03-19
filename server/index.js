// @flow

import express from 'express';
import morgan from 'morgan';
import mincer from 'mincer';
import path from 'path';
import Router from 'named-routes';
import debug from 'debug';
import bodyParser from 'body-parser';

import sequelize from './db';
import passport from 'passport';
import configurePassport from './auth/github';
import saveFormData from './hooks';

const debugServer = debug('interview:server');
const debugError = debug('interview:error');
const app = express();

const passportGithubEnv = {
  github_client_id: process.env.GITHUB_CLIENT_ID || 'hexlet',
  github_client_secret: process.env.GITHUB_CLIENT_SECRET || 'LISP',
  github_callback: process.env.GITHUB_CALLBACK || 'http://127.0.0.1/login/callback',
};

app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

mincer.logger.use(console);

let environment = new mincer.Environment();
environment.enable('source_maps');
environment.enable('autoprefixer');
environment.appendPath('public/css');
environment.appendPath('public/js');
environment.appendPath('node_modules');

app.use(require('express-session')({ secret: 'LISPy cat',
                                     resave: true,
                                     saveUninitialized: true }));
app.use('/assets', mincer.createServer(environment));

process.nextTick(() => {
  configurePassport(passportGithubEnv);
  app.use(passport.initialize());
  app.use(passport.session());
});

if (process.env.NODE_ENV === 'production') {
  environment.cache = new mincer.FileStore(path.join(__dirname, 'cache'));
  environment.jsCompressor = 'uglify';
  environment.cssCompressor = 'csswring';
  environment = environment.index;
}

const router = new Router();
router.extendExpress(app);
router.registerAppHelpers(app);

app.get('/', 'home', (req, res) => {
  res.render('index');
});

async function saveToDb(data, reqType) {
  if (reqType === 'add-applicant') {
    debugServer('POST /add-applicant', data);
    await sequelize.models.user.createApplicant(data);
  } else if (reqType === 'add-interviewer') {
    debugServer('POST /add-interviewer', data);
    await sequelize.models.user.createInterviewer(data);
  }
}

app.get('/login/callback', 'callback', passport.authenticate('github', { failureRedirect: '/' }),
       (req, res) => {
         const data = req.session.initBody;
         const type = req.session.requestType;
         data.email = (req.user.emails && req.user.emails[0] && req.user.emails[0].value) || 'no public email';

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

app.use((err, req, res, next) => {
  debugError(err);
  res.status(500).send();
  next();
});

sequelize.sync().then(() => {
  debugServer('connected to database');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, err => {
  if (err) {
    debugServer(err);
  }
  debugServer(`Started on http://localhost:${port}`);
});

export default server;

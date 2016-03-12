// @flow

import express from 'express';
import morgan from 'morgan';
import mincer from 'mincer';
import path from 'path';
import Router from 'named-routes';
import debug from 'debug';
import bodyParser from 'body-parser';

import sequelize from './db';

const debugServer = debug('interview:server');
const debugError = debug('interview:error');
const app = express();

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

app.use('/assets', mincer.createServer(environment));

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

app.post('/add-interviewer', 'add-interviewer', async (req, res) => {
  debugServer('POST /add-interviewer', req.body);

  await sequelize.models.user.createInterviewer(req.body);

  res.redirect(app.namedRoutes.build('home'));
});

app.post('/add-applicant', 'add-applicant', async (req, res) => {
  debugServer('POST /add-interviewer', req.body);

  await sequelize.models.user.createApplicant(req.body);

  res.redirect(app.namedRoutes.build('home'));
});

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

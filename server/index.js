// @flow

import express from 'express';
import morgan from 'morgan';
import postcssMiddleware from 'postcss-middleware';
import path from 'path';
import precss from 'precss';
import cssnext from 'postcss-cssnext';

const app = express();
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use('/css', postcssMiddleware({
  src(req) {
    return path.join('public', 'css', req.url);
  },
  plugins: [
    cssnext(),
    precss(),
  ],
}));

app.get('/', (req, res) => {
  res.render('index');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, err => {
  if (err) {
    console.log(err);
  }
  console.log(`Started on http://localhost:${port}`);
});

export default server;

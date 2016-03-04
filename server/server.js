const express = require('express');
const morgan = require('morgan');


const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('hello');
});


const port = process.env.PORT || 3000;
module.exports = app.listen(port, err => {
  if (err) {
    console.log(err);
  }
  console.log(`Started on http://localhost:${port}`);
});

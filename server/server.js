const express = require('express');
const morgan = require('morgan');


const app = express();
app.set('view engine', 'jade');
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.render('index');
});


const port = process.env.PORT || 3000;
module.exports = app.listen(port, err => {
  if (err) {
    console.log(err);
  }
  console.log(`Started on http://localhost:${port}`);
});

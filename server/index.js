import express from 'express';
import morgan from 'morgan';

const app = express();
app.set('view engine', 'jade');
app.use(morgan('dev'));

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

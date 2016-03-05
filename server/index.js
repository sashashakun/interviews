import express from 'express';
import morgan from 'morgan';
import mincer from 'mincer';

const app = express();
app.set('view engine', 'jade');
app.use(morgan('dev'));

mincer.logger.use(console);

const environment = new mincer.Environment();
environment.enable('source_maps');
environment.enable('autoprefixer');
environment.appendPath('public/css');
environment.appendPath('node_modules');

app.use('/assets', mincer.createServer(environment));


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

// @flow

function registerRoutes(app:any) {
  app.get('/', 'home', (req, res) => {
    res.render('index');
  });
}

export default {
  registerRoutes,
};

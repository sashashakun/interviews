// @flow

function registerRoutes(app:any) {
  app.get('/about', 'about', (req, res) => {
    res.send('About Interview');
  });
}

export default {
  registerRoutes,
};

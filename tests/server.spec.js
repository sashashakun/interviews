const request = require('supertest');

describe('basic', function () {
  beforeEach(() => {
    this.server = require('../server/server');
  });

  it('should have / page', done => {
    request(this.server)
      .get('/')
      .expect(200, done);
  });

  it('should send 404 if type to get unknown page', done => {
    request(this.server)
      .get('/not-found')
      .expect(404, done);
  });
});

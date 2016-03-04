const request = require('supertest');

describe('basic', function () {
  beforeEach(() => {
    this.server = require('../server/server');
  });

  it('/', done => {
    request(this.server)
      .get('/')
      .expect(200, done);
  });
});

import request from 'supertest';
import server from '../server';

describe('basic', () => {
  it('should have / page', done => {
    request(server)
      .get('/')
      .expect(200, done);
  });

  it('should send 404 if type to get unknown page', done => {
    request(server)
      .get('/not-found')
      .expect(404, done);
  });
});

import request from 'supertest';
import server from '../server';

describe('basic', () => {
  it('should have / page', done => {
    request(server)
      .get('/')
      .expect(200, done);
  });

  it('should send 404 if try to get unknown page', done => {
    request(server)
      .get('/not-found')
      .expect(404, done);
  });

  it('should return styles', done => {
    request(server)
      .get('/assets/styles.css')
      .expect(200, done);
  });
});

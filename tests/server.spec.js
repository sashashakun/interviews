// @flow

import 'babel-polyfill';
import request from 'supertest';
import server from '../app';

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

  it('should return styles', function (done) {
    this.timeout(10000);
    request(server)
      .get('/assets/style.css')
      .expect(200, done);
  });

  it('should return scripts', done => {
    request(server)
      .get('/assets/index.js')
      .expect(200, done);
  });
});

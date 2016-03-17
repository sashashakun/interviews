// @flow

import 'babel-polyfill';
import request from 'supertest';
import passport from 'passport';
import express from 'express';
import mock from './mocks/passport.strategy.mock';

const app = express();
app.use(require('express-session')({ secret: 'secret',
                                     saveUninitialized: true,
                                     resave: true }));
app.use(passport.initialize());
app.use(passport.session());

const verify = (_, done) => {
  const mockedUser = {
    id: 1,
    role: 'goodOne',
    first_name: 'Sh',
    last_name: 'Doe',
  };
  done(null, mockedUser);
};

const errorAuth = (user, done) => {
  done(new Error('Please authenticate within github'));
};

describe('Protected routes access', () => {
  beforeEach(done => done());
  const goodOptions = {
    passAuthentication: true,
    userId: 1,
  };

  const crippyOptions = {
    passAuthentication: false,
    userId: 0,
  };

  const formData = {
    lang: 'js',
    city: 'Berlin',
  };

  describe('POST /add-applicant', () => {
    it('must allow access to /add-applicant if auth == true', (done) => {
      const server = mock(app, goodOptions, verify);
      request(server).
        post('/add-applicant').
        send(formData).
        expect(200).
        end((err, res) => {
          if (err) {
            return done(err);
          }

          return done(null, res);
        });
    });

    it('must not allow access to /add-applicant if auth == false', (done) => {
      const server = mock(app, crippyOptions, errorAuth);
      request(server).
        post('/add-applicant').
        send(formData).
        expect(401).
        end((err, res) => {
          if (err) {
            return done(err);
          }

          return done(null, res);
        });
    });
  });

  describe('POST /add-interviewer', () => {
    it('must allow access to /add-interviewer', (done) => {
      const server = mock(app, goodOptions, verify);
      request(server).
        post('/add-interviewer').
        expect(200).
        end((err, res) => {
          if (err) {
            done(err);
          }

          return done(null, res);
        });
    });

    it('must not allow access to /add-interviewer if auth == false', (done) => {
      const server = mock(app, crippyOptions, errorAuth);
      request(server).
        post('/add-interviewer').
        expect(401).
        end((err, res) => {
          if (err) {
            return done(err);
          }

          return done(null, res);
        });
    });
  });
});

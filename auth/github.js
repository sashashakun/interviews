// @flow

type EnvContainer = {
  github_client_id: ?string,
  github_client_secret: ?string,
  github_callback: ?string,
}

import passport from 'passport';
import Strategy from 'passport-github';
import debug from 'debug';
const debugServer = debug('interview:server');

export default function configurePassport(env: EnvContainer) {
  process.nextTick(() => {
    passport.serializeUser((user, cb) => cb(null, user));
    passport.deserializeUser((obj, cb) => cb(null, obj));

    passport.use(
        new Strategy(
          {
            clientID: env.github_client_id,
            clientSecret: env.github_client_secret,
            callbackURL: env.github_callback,
            passReqToCallback: true,
            scope: 'user:email',
          },
        (req, accessToken, refreshToken, profile, done) => {
          if (!accessToken) {
            return done(new Error('Shit just happen'));
          }

          return process.nextTick(() => {
            debugServer('Access token obtain. Proceeding to redirect');
            return done(null, profile);
          });
        })
    );
  });
}

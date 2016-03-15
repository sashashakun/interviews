// @flow

type Options = {
  passAuthentication: boolean,
  userId: number,
}

import 'babel-polyfill';
import passport from 'passport';

class StrategyMock extends passport.Strategy {
  constructor(options, verify) {
    super(options, verify);
    this.name = 'mock';
    this.passAuthentication = options.passAuthentication || true;
    this.userId = options.userId || 1;
    this.verify = verify;
  }
}

StrategyMock.prototype.authenticate = function authenticate(req) {
  if (this.passAuthentication) {
    const user = {
      id: this.userId,
    };
    const self = this;
    this.request = req;
    this.verify(user, (err, resident) => {
      if (err) {
        self.fail(err);
      } else {
        self.success(resident);
      }
    });
  } else {
    this.fail('Unauthorized');
  }
};

const mock = (app: any, ops: Options, verify: ?mixed): any => {
  passport.use(new StrategyMock(ops, verify));
  app.post('/add-applicant', passport.authenticate('mock'), (req, res) =>
            res.send(ops)
          );
  app.post('/add-interviewer', passport.authenticate('mock'), (req, res) =>
            res.send(ops)
          );

  return app;
};

export default mock;

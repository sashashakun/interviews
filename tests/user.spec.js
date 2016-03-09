// @flow

import 'babel-polyfill';

import _ from 'lodash';
import assert from 'assert';
import sinon from 'sinon';
import sequelize from '../db';

describe('create user methods', () => {
  it('should create sequelize user model with applicant data', done => {
    const testData = {
      city: 'city',
      langs: 'langs',
    };
    const callData = _.extend(testData, { type: 'applicant' });

    const stub = sinon.stub(sequelize.models.user, 'create');

    sequelize.models.user.createApplicant(testData);
    assert.ok(stub.calledOnce);
    assert.deepEqual(stub.firstCall.args, [callData]);

    stub.restore();

    done();
  });

  it('should create sequelize user model with interviewer data', done => {
    const testData = {
      city: 'city',
      langs: 'langs',
      company: 'company',
      position: 'position',
    };
    const callData = _.extend(testData, { type: 'interviewer' });

    const stub = sinon.stub(sequelize.models.user, 'create');

    sequelize.models.user.createInterviewer(testData);
    assert.ok(stub.calledOnce);
    assert.deepEqual(stub.firstCall.args, [callData]);

    stub.restore();

    done();
  });
});

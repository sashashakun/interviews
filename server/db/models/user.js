// @flow weak

import _ from 'lodash';

export default function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    // see http://docs.sequelizejs.com/en/latest/docs/models-definition/
    type: {
      type: DataTypes.ENUM,
      values: ['interviewer', 'applicant'],
    },
    email: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    langs: {
      type: DataTypes.STRING,
    },
    company: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
    },
  }, {
    classMethods: {
      createInterviewer: (data) => {
        const interviewerFields = ['email', 'city', 'langs', 'company', 'position'];
        const userData = _(data).pick(interviewerFields)
          .extend({ type: 'interviewer' }).value();

        return sequelize.models.user.create(userData);
      },
      createApplicant: (data) => {
        const interviewerFields = ['email', 'city', 'langs'];
        const userData = _(data).pick(interviewerFields)
          .extend({ type: 'applicant' }).value();

        return sequelize.models.user.create(userData);
      },
    },
  });

  return User;
}

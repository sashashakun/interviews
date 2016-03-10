// @flow weak

export default function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    // see http://docs.sequelizejs.com/en/latest/docs/models-definition/
    first_name: {
      type: DataTypes.STRING,
    },
  });

  return User;
}

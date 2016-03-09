export default function (sequelize, DataTypes) {
  var User = sequelize.define('user', {
    // see http://docs.sequelizejs.com/en/latest/docs/models-definition/
    first_name: {
      type: DataTypes.STRING
    }
  });
};

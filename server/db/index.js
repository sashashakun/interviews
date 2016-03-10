// @flow

import fs from 'fs';
import path from 'path';
import debug from 'debug';
import Sequelize from 'sequelize';

const connectionString = process.env.DATABASE_URL;
const modelsPath = path.resolve(__dirname, 'models');
const debugDatabase = debug('interview:db');

const sequelize = new Sequelize(connectionString, {
  // specify logging function
  // or false to disable logging
  logging: debugDatabase,

  define: {
    underscored: true,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: true,
  },
});

fs.readdirSync(modelsPath)
  .forEach(model => sequelize.import(path.join(modelsPath, model)));

export default sequelize;

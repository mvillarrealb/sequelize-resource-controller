const Sequelize = require('sequelize');
const path = require('path');

const databasePath = path.join(__dirname, 'todo_list.db');

const sequelize = new Sequelize(`sqlite:${databasePath}`, {
  define: {
    freezeTableName: true,
    underscored: true
  },
  logging: false
});

const todo = sequelize.define('todo', {
  todo_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  is_done: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

const models = { todo };

module.exports = { sequelize, models, databasePath };

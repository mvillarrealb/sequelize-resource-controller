const Sequelize = require('sequelize');
const bulkPoints = require('../data/pois_data');

const sequelize = new Sequelize('sqlite:feeds.db', {
  define: {
    freezeTableName: true,
    underscored: true
  },
  logging: false
});

const models = {
  poi: sequelize.define('pois', {
    poi_id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    latitude: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    longitude: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  })
};

module.exports = {
  start: () => {
    return sequelize.sync({ force: true }).then(() => {
      return models.poi.bulkCreate(bulkPoints);
    });
  },
  destroy: done => {
    return done();
  },
  sequelize,
  Sequelize,
  models
};

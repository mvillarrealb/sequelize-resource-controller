const { restify, express } = require('../../../');

module.exports = ({ sequelize, models }, controllerType) => {
  const { poi } = models;
  const PoiController =
    controllerType === 'express' ? new express(sequelize, poi) : new restify(sequelize, poi);

  return { PoiController };
};

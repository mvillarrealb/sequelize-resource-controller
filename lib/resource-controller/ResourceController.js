const debug = require('debug')('sequelize-resource:resource-controller');
const ResourceError = require('../errors/ResourceError');
const SequelizeError = require('../errors/SequelizeError');
const errorCodes = require('../errors/error_map');
/**
 * @class ResourceController
 * @author Marco Villarreal
 */
class ResourceController {
  /**
   * @property SORT_ORDERS
   * @static
   * @type {Array}
   */
  static get SORT_ORDERS() {
    return ['ASC', 'DESC'];
  }

  /**
   * @constructor
   * @param {Sequelize} sequelize
   * @param {Sequelize.Model} model
   */
  constructor(sequelize, model) {
    this.sequelize = sequelize;
    this.model = model;
    this.modelAttributes = Object.keys(this.model.attributes);
    this.getPrimaryKey();
    this.ERROR_CODES = errorCodes;
  }

  /**
   * @method sortOrderSupported
   * @param {String} sortOrder
   * @return {Boolean}
   */
  sortOrderSupported(sortOrder) {
    return ResourceController.SORT_ORDERS.indexOf(sortOrder.toUpperCase()) >= 0;
  }

  /**
   * @method attributeExists
   * @param {String} attribute
   * @return {Boolean}
   */
  attributeExists(attribute) {
    return this.modelAttributes.indexOf(attribute) >= 0;
  }

  /**
   * @method setBaseURL
   * @param {String} baseURL
   */
  setBaseURL(baseURL) {
    if (this.baseURL == null) {
      this.baseURL = baseURL;
    }
  }

  /**
   *
   * @method _getPrimaryKey
   * @return {Array}
   */
  getPrimaryKey() {
    if (!this.primaryKey) {
      this.primaryKey = Object.keys(this.model.primaryKeys);
    }
    return this.primaryKey;
  }

  /**
   * @method sequelizeError
   * @param {Error} originalError
   * @return {SequelizeError}
   */
  sequelizeError(originalError) {
    return new SequelizeError(originalError);
  }

  /**
   * @method resourceError
   * @param {String} errorCode
   * @param {String} message
   * @returns {ResourceError}
   */
  resourceError(errorType, message) {
    return new ResourceError(errorType, message);
  }
}

ResourceController.prototype.findOne = require('./methods/findOne')(debug);
ResourceController.prototype.findAll = require('./methods/findAll')(debug);
ResourceController.prototype.destroy = require('./methods/destroy')(debug);
ResourceController.prototype.update = require('./methods/update')(debug);
ResourceController.prototype.create = require('./methods/create')(debug);

module.exports = ResourceController;

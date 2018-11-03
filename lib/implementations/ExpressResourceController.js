const debug = require('debug')('sequelize-resource:express-resource-controller');
const BaseRestController = require('./BaseRestController');

/**
 *
 */
class ExpressResourceController extends BaseRestController {
  constructor(sequelize, model) {
    super(sequelize, model);
    this.implementation = 'express';
  }

  setHeaders(responseHandler, headers) {
    responseHandler.set(headers);
  }

  sendResponse(responseHandler, httpStatus, responseBody) {
    return responseHandler.status(httpStatus).send(responseBody);
  }

  checkJsonHeader(requestInfo) {
    return requestInfo.is('application/json');
  }

  createHATEOABaseURL(req) {
    if (this.baseURL == null) {
      debug('Hateoas baseURL not found creating one');
      this.baseURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      debug('Hateoas Url created with path %o', this.baseURL);
      this.resource.setBaseURL(this.baseURL);
    }
    return this.baseURL;
  }
}

module.exports = ExpressResourceController;

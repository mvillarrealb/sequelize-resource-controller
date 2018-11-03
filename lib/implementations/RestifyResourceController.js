const debug = require('debug')('sequelize-resource:restify-resource-controller');
const BaseRestController = require('./BaseRestController');

class RestifyResourceController extends BaseRestController {
  constructor(sequelize, model) {
    super(sequelize, model);
    this.implementation = 'restify';
  }

  setHeaders(responseHandler, headers) {
    responseHandler.set(headers);
  }

  sendResponse(responseHandler, httpStatus, responseBody) {
    return responseHandler.send(httpStatus, responseBody);
  }

  checkJsonHeader(requestInfo) {
    return requestInfo.is('application/json');
  }

  createHATEOABaseURL(req) {
    if (this.baseURL == null) {
      const protocol = req.isSecure() ? 'https' : 'http';
      const path = this.cleanPath(req.getRoute().path);
      debug('Hateoas baseURL not found creating one');
      this.baseURL = `${protocol}://${req.headers.host}${path}`;
      debug('Hateoas Url created with path %o', this.baseURL);
      this.resource.setBaseURL(this.baseURL);
    }
    return this.baseURL;
  }

  cleanPath(basePath) {
    return basePath.replace(/\/:\S+/g, '');
  }
}

module.exports = RestifyResourceController;

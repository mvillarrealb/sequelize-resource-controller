const ExpressController = require('./lib/implementations/ExpressResourceController');
const RestifyController = require('./lib/implementations/RestifyResourceController');
const ResourceController = require('./lib/resource-controller/ResourceController');

module.exports = {
  express: ExpressController,
  restify: RestifyController,
  resourceController: ResourceController
};

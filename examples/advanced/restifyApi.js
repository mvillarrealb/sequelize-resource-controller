const restify = require('restify');
const debug = require('debug')('sequelize-resource-controller:demo:express');
const LiteRouter = require('node-lite-router');
const db = require('./models');
const controllers = require('./controllers')(db, 'restify');
const routesList = require('./routes');

(async function restifyApi() {
  const app = restify.createServer();
  const routerHandler = LiteRouter.restify.init({
    controllers,
    middlewares: {}
  });

  app.use(restify.plugins.bodyParser());
  app.use(restify.plugins.queryParser());
  const handler = await routerHandler.publishRoutes(routesList);

  await handler.bindApplication(app);

  app.listen(4000, () => {
    debug('Sucessfully started api on port 4000');
  });
})();

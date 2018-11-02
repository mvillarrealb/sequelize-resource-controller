const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('sequelize-resource-controller:demo:express');
const LiteRouter = require('node-lite-router');
const db = require('./models');

const controllers = require('./controllers')(db, 'express');
const routesList = require('./routes');

(async function expressApp() {
  const app = express();
  const routerHandler = LiteRouter.express.init({
    controllers,
    middlewares: {}
  });

  app.use(bodyParser.json());

  const handler = await routerHandler.publishRoutes(routesList);

  await handler.bindApplication(app);
  await db.start();
  app.listen(4000, () => {
    debug('Sucessfully started api on port 4000');
  });
})();

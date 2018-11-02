const restify = require('restify');
const { Router } = require('restify-router');
const restifyController = require('../../').restify;
const { sequelize, models } = require('./db');

(async function main() {
  const app = restify.createServer();
  const { todo } = models;
  const yourController = new restifyController(sequelize, todo);
  const yourRouter = new Router();

  yourRouter.get('/v1/todos', yourController.list.bind(yourController));
  yourRouter.post('/v1/todos', yourController.create.bind(yourController));
  yourRouter.get('/v1/todos/:todo_id', yourController.getOne.bind(yourController));

  yourRouter.put('/v1/todos/:todo_id', [
    yourController.getOneMiddleware.bind(yourController),
    yourController.update.bind(yourController)
  ]);

  yourRouter.del('/v1/todos/:todo_id', [
    yourController.getOneMiddleware.bind(yourController),
    yourController.destroy.bind(yourController)
  ]);

  yourRouter.applyRoutes(app);

  await sequelize.sync();
  app.use(restify.plugins.bodyParser());
  app.use(restify.plugins.queryParser());
  app.listen(8000, () => {
    console.log('Ready to rock');
  });
})();

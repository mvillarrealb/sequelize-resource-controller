const restify = require('restify');
const { Router } = require('restify-router');
const RestifyController = require('../../').restify;
const { sequelize, models } = require('./mockDb');

const { todo } = models;

class RestifyApi {
  async start(port, done) {
    const server = this.createServer();
    await sequelize.sync({ force: true });
    server.listen(port, done);
  }

  async stop() {
    process.exit(0);
  }

  createServer() {
    const server = restify.createServer();
    server.use(restify.plugins.bodyParser());
    server.use(restify.plugins.queryParser());
    this.getRestifyRoutes().applyRoutes(server);
    return server;
  }

  getRestifyRoutes() {
    const restifyRouter = new Router();
    const controller = new RestifyController(sequelize, todo);
    restifyRouter.get('/v1/todos', controller.list.bind(controller));
    restifyRouter.post('/v1/todos', controller.create.bind(controller));
    restifyRouter.get('/v1/todos/:todo_id', controller.getOne.bind(controller));

    restifyRouter.put('/v1/todos/:todo_id', [
      controller.getOneMiddleware.bind(controller),
      controller.update.bind(controller)
    ]);

    restifyRouter.del('/v1/todos/:todo_id', [
      controller.getOneMiddleware.bind(controller),
      controller.destroy.bind(controller)
    ]);
    return restifyRouter;
  }

  async insertMockRecord(data) {
    let error = null;
    let response = null;
    try {
      response = await todo.create(data);
      response = response.get({ plain: true });
    } catch (exception) {
      error = exception;
    }
    return { error, response };
  }
}

module.exports = RestifyApi;

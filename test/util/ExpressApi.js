const express = require('express');
const bodyParser = require('body-parser');
const ExpressController = require('../../').express;
const { sequelize, models } = require('./mockDb');

const { todo } = models;

class ExpressApi {
  async start(port, done) {
    const server = this.createServer();
    await sequelize.sync({ force: true });
    server.listen(port, done);
  }

  async stop() {
    process.exit(0);
  }

  createServer() {
    const server = express();
    server.use(bodyParser.json());
    server.use('/v1/todos', this.getExpressRoutes());
    return server;
  }

  getExpressRoutes() {
    const expressRouter = express.Router();
    const controller = new ExpressController(sequelize, todo);
    expressRouter.route('/').get(controller.list.bind(controller));
    expressRouter.route('/').post(controller.create.bind(controller));
    expressRouter.route('/:todo_id').get(controller.getOne.bind(controller));

    expressRouter
      .route('/:todo_id')
      .put([controller.getOneMiddleware.bind(controller), controller.update.bind(controller)]);

    expressRouter
      .route('/:todo_id')
      .delete([controller.getOneMiddleware.bind(controller), controller.destroy.bind(controller)]);
    return expressRouter;
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

module.exports = ExpressApi;

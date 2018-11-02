const express = require('express');
const restify = require('restify');
const { Router } = require('restify-router');
const bodyParser = require('body-parser');

const expressController = require('../../').express;
const restifyController = require('../../').restify;
const { sequelize, models } = require('./mockDb');

const { todo } = models;

const mockApi = {
  createServer: provider => {
    let server = null;
    if (provider === 'express') {
      server = express();
      server.use(bodyParser.json());
      server.use('/v1/todos', mockApi.getExpressRoutes());
    } else if (provider === 'restify') {
      server = restify.createServer();
      server.use(restify.plugins.bodyParser());
      server.use(restify.plugins.queryParser());
      mockApi.getRestifyRoutes().applyRoutes(server);
    } else {
      throw new Error('Unsupported mock server provider');
    }
    return server;
  },
  getRestifyRoutes: () => {
    const restifyRouter = new Router();
    const controller = new restifyController(sequelize, todo);
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
  },
  getExpressRoutes: () => {
    const expressRouter = express.Router();
    const controller = new expressController(sequelize, todo);
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
  },
  stop: () => {
    process.exit(0);//Temporary fix, need a better way to do this
  },
  start: async (port, provider, done) => {
    const server = mockApi.createServer(provider);
    await sequelize.sync({ force: true });
    server.listen(port, done);
  },
  insertMockRecord: async data => {
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
};

module.exports = mockApi;

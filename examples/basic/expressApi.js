const express = require('express');
const bodyParser = require('body-parser');
const expressController = require('../../').express;
const { sequelize, models } = require('./db');

(async function main() {
  const app = express();
  const { todo } = models;
  const yourController = new expressController(sequelize, todo);
  const yourRouter = express.Router();

  yourRouter.route('/').get(yourController.list.bind(yourController));
  yourRouter.route('/').post(yourController.create.bind(yourController));
  yourRouter.route('/:todo_id').get(yourController.getOne.bind(yourController));

  yourRouter
    .route('/:todo_id')
    .put([
      yourController.getOneMiddleware.bind(yourController),
      yourController.update.bind(yourController)
    ]);

  yourRouter
    .route('/:todo_id')
    .delete([
      yourController.getOneMiddleware.bind(yourController),
      yourController.destroy.bind(yourController)
    ]);
  app.use(bodyParser.json());
  app.use('/v1/todos', yourRouter);
  await sequelize.sync();
  app.listen(8000, () => {
    console.log('Ready to rock');
  });
})();

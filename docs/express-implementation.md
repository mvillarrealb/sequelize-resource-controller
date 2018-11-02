# express Implementation
Same as on the restify implementation you have to follow the given steps:

### Basic definitions

```javascript
const express = require('express');
const expressController = require('sequelize-resource-controller').express;
const { sequelize, models } = require('db');
const app = express();
```
### Bind the endpoints using the Controller

```javascript
const { todo } = models;
const yourController = new expressController(sequelize,todo);
const yourRouter = express.Router();
/**
 * It is explicitly mandatory to use bind(controller) to avoid scope errors
 **/
yourRouter.route('/').get(yourController.list.bind(yourController));
yourRouter.route('/').post(yourController.create.bind(yourController));
yourRouter.route('/:todo_id').get(yourController.getOne.bind(yourController));
/**
 * To use getOne and destroy you must use a middleware called
 * getOneMiddleware wich will handle the existence validation(convenient for cool 404 status codes)
 */
yourRouter.route('/:todo_id').put([
  yourController.getOneMiddleware.bind(yourController),
  yourController.update.bind(yourController)
]);

yourRouter.route('/:todo_id').destroy([
  yourController.getOneMiddleware.bind(yourController),
  yourController.destroy.bind(yourController)
]);

app.use('/v1/todos',yourRouter);

```
### Start the server

```javascript
app.listen(8000,() => {
  console.log('Ready to rock');
});
```
# Restify Implementation

The following steps will get you started with sequelize-resource-controller for restify

### Basic definitions

Import the required packages: restify, sequelize and anything else you need.

```javascript
const restify = require('restify');
const { Router }  = require('restify-router');
const restifyController = require('sequelize-resource-controller').restify;
const { sequelize, models } = require('db');
const app = restify.createServer();
```

### Bind the endpoints using the Controller

To perform the binding you just have to use every method in your restifyController instance as shown below:

```javascript
const { todo } = models;
const yourController = new restifyController(sequelize,todo);
const yourRouter = new Router();
/**
 * It is explicitly mandatory to use bind(controller) to avoid scope errors
 **/
//Define a endpoint to query paginated elements of your model
yourRouter.get('/todos',yourController.list.bind(yourController));
//Define an endpoint to create a element of your model
yourRouter.post('/todos',yourController.create.bind(yourController));

//Define and endpoint to find one single element of your model by its id
yourRouter.get('/todos/:todo_id',yourController.getOne.bind(yourController));
/**
 * To use getOne and destroy you must use a middleware called
 * getOneMiddleware wich will handle the existence validation(convenient for cool 404 status codes)
 */
yourRouter.put('/todos/:todo_id', [
  yourController.getOneMiddleware.bind(yourController),
  yourController.update.bind(yourController)
]);
//Define an endpoint to delete a single element of your model by its id
yourRouter.del('/todos/:todo_id',[
  yourController.getOneMiddleware.bind(yourController),
  yourController.destroy.bind(yourController)
]);

yourRouter.applyRoutes(app);
```

### Start the server

Just use your implementation start method on a given port and you are ready to go.

```javascript
app.listen(8000,() => {
  console.log('Ready to rock');
});
```
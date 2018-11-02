# Extending Controller

You can extend the existing implementations to add more functionality aside to the typical CRUD Resource methods.

## Extension example

In this example we are using a ES6 class to extend Express implementation
basically adding a new method called listPending.

```javascript
class TodoResource extends ExpressController {
  
  constructor(sequelize,model) {
    super(sequelize,model);
  }

  async listPending(req,res) {
    try {
      const response = await this.model.findAll({
        where: {
          is_done: false
        }
      });
      //This way it will be compatible for express and restify
      //however you can just use res.status(..).send(..)
      this.sendResponse(res, 200,response);
    } catch(error) {
      //custom formating
      const resourceErr = this.resource.sequelizeError(error);
      this.sendResponse(res, resourceErr.code, resourceErr);
    }
  }
}
```
Afterwards you can easily publish the routes the same way as in the examples and add the new method:

```js
yourRouter.route('/pending').get(yourController.listPending.bind(yourController));

```

This is convenient to basically getting started with the basic REST endpoints and then start adding some more complex endpoints for your api.
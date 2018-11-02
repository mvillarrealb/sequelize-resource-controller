# Resource Controller

The raw implementation its just the internal abstraction layer of your model to manage the CRUD of your sequelize model.

## Import the ResourceController

```javascript
const { resourceController } = require('sequelize-resource-controller');
```
## Creating an instance

```javascript
const myResource = new resourceController(sequelizeInstance, sequelizeModel);
```

## Inserting a model

To insert a model you just have to use the **create** method, it will receive as parameter an object with the model data. It will return a response object with two properties:

* error: Any exception caught in model creation(including validations)
* response: The created model instance(Sequelize.Model instance)

```javascript

const {error,response} = await myResource.create({
  name: 'Document your module'
});
//response will be a Sequelize.Model Instance

console.log(response);

console.log(response.get({ plain:true }));
```

## Finding Models

To find the models you have to use **findAll** method, this method internally uses findAll sequelize's method and takes optional parameters:

* limit: Pagination limit(default to 10)
* offset: THe offset of the paging(default is 0)
* sortOrder:The sort order used in the query(default unused)
* sortField: The sort attributes used in the query(default unused)

This method will return a response object with two properties:

* error: Any exception caught in model querying
* response: a complex object with pagination hinting and the rows found in the query(as plain instances)

```javascript
const {error,response} = await myResource.findAll({ limit: 5, offset: 0});
console.table(response.rows);
```

## Finding by Id

```javascript
const todo_id = '';
const findOneResponse = await myResource.findOne({todo_id});
console.table(findOneResponse.response);
```

## Update a model

```javascript
const todo_id = '';
const findOneResponse = await myResource.findOne({todo_id});
const modelToBeUpdated = findOneResponse.response;

const {error,response} = await myResource.update(modelToBeUpdated, {
  name: 'This todo was updated dude',
  is_done: true
});

console.table(response);

```

## Destroy a model

```javascript
const todo_id = '';
const findOneResponse = await myResource.findOne({todo_id});
const victimModel = findOneResponse.response;

const {error,response} = await myResource.destroy(victimModel);

console.table(response);
```

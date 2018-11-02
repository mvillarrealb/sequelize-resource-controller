const chai = require('chai');
const fs = require('fs');
const ResourceController = require('../../../lib/resource-controller/ResourceController');
const { sequelize, models, databasePath } = require('../../util/mockDb');

const { expect } = chai;
before(done => {
  console.log('Synchronizing database');
  sequelize.sync({ force: true }).then(() => {
    done();
  });
});

after(done => {
  console.log('Destroying database');
  fs.unlink(databasePath, done);
});

describe('ResourceController CRUD Operations', () => {
  const { todo } = models;
  const controllerInstance = new ResourceController(sequelize, todo);

  it('Should create a Model', async () => {
    const name = 'A todo for a todo list';
    const { error, response } = await controllerInstance.create({ name });
    expect(error).to.be.equal(null);
    expect(response).to.be.instanceOf(sequelize.Model);

    const createdTodo = response.get({ plain: true });
    expect(createdTodo).to.have.property('todo_id');
    expect(createdTodo).to.have.property('name', name);
    expect(createdTodo).to.have.property('is_done', false);
    expect(createdTodo).to.have.property('updated_at');
    expect(createdTodo).to.have.property('created_at');
  });

  it('Should find a Model By Id', async () => {
    const name = 'A todo to be updated';
    const createResponse = await controllerInstance.create({ name });
    const plainTodo = createResponse.response.get({ plain: true });
    const { todo_id } = plainTodo;

    const { error, response } = await controllerInstance.findOne({ todo_id });
    const plainFoundRecord = response.get({ plain: true });
    expect(error).to.be.equal(null);
    expect(response).to.be.instanceOf(sequelize.Model);
    expect(plainFoundRecord).to.have.property('todo_id', plainTodo.todo_id);
    expect(plainFoundRecord).to.have.property('name', plainTodo.name);
    expect(plainFoundRecord).to.have.property('is_done', plainTodo.is_done);
  });

  it('Should update a Model', async () => {
    const name = 'Bye World';
    const is_done = true;
    const createResponse = await controllerInstance.create({ name: 'Hello world' });
    const todoToBeUpdated = createResponse.response;

    const { error, response } = await controllerInstance.update(todoToBeUpdated, { name, is_done });
    const plainResponse = response.get({ plain: true });

    expect(error).to.be.equal(null);
    expect(response).to.be.instanceOf(sequelize.Model);
    expect(plainResponse).to.have.property('name', name);
    expect(plainResponse).to.have.property('is_done', is_done);
  });

  it('Should destroy a Model', async () => {
    const createResponse = await controllerInstance.create({ name: 'Hello world' });
    const todoToBeDestroyed = createResponse.response;
    const { error, response } = await controllerInstance.destroy(todoToBeDestroyed);
    const plainResponse = response.get({ plain: true });
    expect(error).to.be.equal(null);
    expect(response).to.be.instanceOf(sequelize.Model);
    expect(plainResponse).to.have.property('todo_id');
    expect(plainResponse).to.have.property('name');
    expect(plainResponse).to.have.property('is_done');
    expect(plainResponse).to.have.property('updated_at');
    expect(plainResponse).to.have.property('created_at');
  });

  it('Should find a collection of models', async () => {
    const todoList = [];
    for (let i = 0; i < 30; i += 1) {
      const name = `Generated todo number ${i}`;
      todoList.push({ name });
    }

    await todo.bulkCreate(todoList);//to have enough result to generate paging
    const { error, response } = await controllerInstance.findAll();

    expect(error).to.be.equal(null);
    expect(response).to.be.instanceOf(Object);
    expect(response).to.have.property('rows');
    expect(response).to.have.property('paging');
    expect(response).to.have.nested.property('paging.next');
    expect(response).to.have.nested.property('paging.previous');
    expect(response).to.have.nested.property('paging.first');

    const { rows, paging } = response;
    const { next, previous, first } = paging;

    expect(rows).to.be.instanceof(Array);
    expect(rows).to.have.length(10);
    expect(next).to.have.property('limit', 10);
    expect(next).to.have.property('offset', 10);
    expect(first).to.have.property('limit', 10);
    expect(first).to.have.property('offset', 0);
    expect(previous).to.be.equal(null);
  });
});

describe('ResourceController Error Handling', () => {
  const { todo } = models;
  const controllerInstance = new ResourceController(sequelize, todo);

  it('Should validate model errors on create', async () => {
    const { error, response } = await controllerInstance.create({});
    expect(response).to.be.equal(null);
    expect(error).to.be.instanceof(Error);
  });

  it('Should validate findAll limit errors', async () => {
    const limit = 'A';
    const { error } = await controllerInstance.findAll({ limit });
    expect(error).to.have.property('message', 'Limit A or offset 0 are not numbers');
  });

  it('Should validate findAll limit errors 2', async () => {
    const limit = 200;
    const { error } = await controllerInstance.findAll({ limit });
    expect(error).to.have.property(
      'message',
      'Limit 200 is lower than zero(0) or is greater than 100(limit per page)'
    );
  });

  it('Should validate findAll offset errors', async () => {
    const offset = -1;
    const { error } = await controllerInstance.findAll({ offset });
    expect(error).to.have.property('message', 'Negative offset is unsupported');
  });

  it('Should validate findAll sort errors', async () => {
    const sortField = 'unexistentAttribute';
    const sortOrder = 'ASC';
    const { error } = await controllerInstance.findAll({ sortField, sortOrder });
    expect(error).to.have.property('message', 'Unsupported resource attribute unexistentAttribute');
  });

  it('Should validate findAll sort errors 2', async () => {
    const sortOrder = 'SORTORDER';
    const sortField = 'name';
    const { error } = await controllerInstance.findAll({ sortOrder, sortField });
    expect(error).to.have.property('message', 'Unsupported sort order SORTORDER');
  });

  it('Should handle errors for destroy method', async () => {
    const { error } = await controllerInstance.destroy({});
    expect(error).to.be.instanceOf(Error);
  });

  it('Should handle errors for update method', async () => {
    const createResponse = await controllerInstance.create({ name: 'Hello world' });
    const modelToBeUpdated = createResponse.response;
    //breaking not null constraint on purposse
    const { error } = await controllerInstance.update(modelToBeUpdated, {
      name: null
    });
    expect(error).to.be.instanceOf(Error);
  });

  it('Should handle not found errors for findOne method', async () => {
    const todo_id = '4ab4f5fd-08a6-4740-9bd1-1dea687f7132';
    const { error } = await controllerInstance.findOne({ todo_id });
    expect(error).to.be.instanceOf(Error);
    expect(error).to.have.property('message', 'Model not Found for requested Ids');
  });
  it('Should handle invalid findOne attributes', async () => {
    const troll_attribute = 'troll value';
    const { error } = await controllerInstance.findOne({ troll_attribute });
    expect(error).to.be.instanceOf(Error);
    expect(error).to.have.property(
      'message',
      'The following find attributes are unsupported by the resource troll_attribute'
    );
  });
});

const chai = require('chai');
const chaiHttp = require('chai-http');
const mockApi = require('../util/mockApi');

const API_BASE_URL = 'http://localhost:9000';
const { expect } = chai;
chai.use(chaiHttp);

before(done => {
  mockApi.start(9000, 'restify', done);
});

after(done => {
  mockApi.stop();
});

describe('Restify Controller integration tests', () => {
  context('Http POST request', async () => {
    it('Will create a Resource', async () => {
      const response = await chai
        .request(API_BASE_URL)
        .post('/v1/todos')
        .type('application/json')
        .send({
          name: 'A todo Element :D'
        });
      expect(response).to.have.status(201);
      expect(response).to.be.json;
      expect(response.body).to.have.property('todo_id');
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('is_done');
      expect(response.body).to.have.property('updated_at');
      expect(response.body).to.have.property('created_at');
      expect(response.body).to.have.property('links');
      expect(response.body).to.have.nested.property('links.self.href');
    });

    it('Will generate Resource creation errors', async () => {
      const response = await chai
        .request(API_BASE_URL)
        .post('/v1/todos')
        .type('application/json')
        .send({});
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.have.property('status', 'FAILED_PRECONDITION');
      expect(response.body).to.have.property('code');
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('details');
    });
  });

  context('Http GET request', () => {
    it('Should find the requested Resources', async () => {
      const response = await chai
        .request(API_BASE_URL)
        .get('/v1/todos')
        .send();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.have.property('rows');
      expect(response.body).to.have.property('links');
      expect(response.body).to.have.nested.property('links.first');
      expect(response.body).to.have.nested.property('links.next');
      expect(response.body).to.have.nested.property('links.previous');
    });

    it('Should generate resource find errors', async () => {
      const response = await chai
        .request(API_BASE_URL)
        .get('/v1/todos')
        .query({
          offset: -1
        });
      //console.log(response.body);
      expect(response).to.be.json;
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('code');
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('details');
    });
  });

  context('HTTP GET by Id request', () => {
    it('Should find a resource by its Ids', async () => {
      const name = 'TODO TO BE FOUND';
      const { response } = await mockApi.insertMockRecord({ name });
      const { todo_id } = response;
      const res = await chai
        .request(API_BASE_URL)
        .get(`/v1/todos/${todo_id}`)
        .send();
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('todo_id');
      expect(res.body).to.have.property('name');
      expect(res.body).to.have.property('is_done');
      expect(res.body).to.have.property('updated_at');
      expect(res.body).to.have.property('created_at');
      expect(res.body).to.have.property('links');
      expect(res.body).to.have.nested.property('links.self.href');
    });
    it('Should generate an error when finding a resource', async () => {
      const todo_id = '4ab4f5fd-08a6-4740-9bd1-1dea687f7171';
      const res = await chai
        .request(API_BASE_URL)
        .del(`/v1/todos/${todo_id}`)
        .send();
      expect(res).to.have.status(404);
      expect(res).to.be.json;
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('code');
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('details');
    });
  });

  context('HTTP PUT request', () => {
    it('Update an existing resource by its id', async () => {
      const { response } = await mockApi.insertMockRecord({ name: 'a todo :D' });
      const { todo_id } = response;
      const name = 'This todo was updated :D';
      const is_done = true;

      const res = await chai
        .request(API_BASE_URL)
        .put(`/v1/todos/${todo_id}`)
        .type('application/json')
        .send({ name, is_done });
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('todo_id');
      expect(res.body).to.have.property('name', name);
      expect(res.body).to.have.property('is_done', is_done);
      expect(res.body).to.have.property('updated_at');
      expect(res.body).to.have.property('created_at');
    });

    it('Should generate errors on update a resource', async () => {
      const { response } = await mockApi.insertMockRecord({ name: 'a todo :D' });
      const { todo_id } = response;
      const res = await chai
        .request(API_BASE_URL)
        .put(`/v1/todos/${todo_id}`)
        .type('application/json')
        .send({ name: null });
      expect(res).to.be.json;
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('code');
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('details');
    });
  });

  context('HTTP DELETE request', () => {
    it('Should delete an existing resource by its id', async () => {
      const { response } = await mockApi.insertMockRecord({ name: 'Other todo' });
      const { todo_id } = response;
      const res = await chai
        .request(API_BASE_URL)
        .del(`/v1/todos/${todo_id}`)
        .send();
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('todo_id');
      expect(res.body).to.have.property('name');
      expect(res.body).to.have.property('is_done');
      expect(res.body).to.have.property('updated_at');
      expect(res.body).to.have.property('created_at');
    });

    it('Should generate deletion errors on the resource', async () => {
      const todo_id = '4ab4f5fd-08a6-4740-9bd1-1dea687f7132';
      const res = await chai
        .request(API_BASE_URL)
        .del(`/v1/todos/${todo_id}`)
        .send();
      expect(res).to.be.json;
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('code');
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('details');
    });
  });

});
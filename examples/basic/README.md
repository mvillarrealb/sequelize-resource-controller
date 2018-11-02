# sequelize-resource-controller Basic Example

This is the sequelize-resource-controller basic example.

# Endpoints

Endpoint|verb|Description
--|---|---
/todos|POST| Creates a new TODO
/todos|GET| Gets all TODOS
/todos/:todo_id|GET| Get a single TODO by id
/todos/:todo_id|PUT| Updates a Todo
/todos/:todo_id|DELETE| Deletes a single todo
---

# Starting the Apis

## Restify
```bash
npm run restify
```

## Express

```bash
npm run express
```
---

# Examples using Postman

Use [this postman collection](./todo-api.postman_collection.json) to validate your api behavior
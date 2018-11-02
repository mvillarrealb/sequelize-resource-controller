# sequelize-resource-controller Advanced Example

This is the sequelize-resource-controller advanced example.

# Endpoints

Endpoint|verb|Description
--|---|---
/v1/points-of-interest|POST|Creates a point of interest
/v1/points-of-interest|GET|Gets all the points of interest in a paginated fashion
/v1/points-of-interest/:poi_id|PUT| Updates a point of interest
/v1/points-of-interest/:poi_id|DELETE| Deletes a point of interest
/v1/points-of-interest/:poi_id|GET| Finds a particular a point of interest

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

Use [this postman collection](./poi-api.postman_collection.json) to validate your api behavior
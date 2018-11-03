# sequelize-resource-controller

[![npm version](https://img.shields.io/npm/v/sequelize-resource-controller.svg)](https://www.npmjs.com/package/sequelize-resource-controller)

[![Build Status](https://travis-ci.org/mvillarrealb/sequelize-resource-controller.svg?branch=master)](https://travis-ci.org/mvillarrealb/sequelize-resource-controller)

![node](https://img.shields.io/node/v/sequelize-resource-controller.svg)

sequelize-resource-controller is a REST Resource abstraction layer, wich handles all the burden of creating transactions, handling rollbacks and formatting responses for your Resource based Api with sequelize. 

Provides support for Restify and Express, two of the most popular http frameworks for nodejs.

# Installation

```bash
npm install --save sequelize-resource-controller
```

# Testing

## Run all tests

```bash
npm test
```

## Run unit tests only

```bash
npm run unit-test
```

## Run integ tests only

```bash
npm run integ-test
```

---

# Generate ESDOC Documentation

```bash
npm run docs
```
---

# Examples

# Basic Example (Todo List Api)

The basic example is just a straighforward todo Api with very few files(one file for the database & models, and one for each implementation).

Endpoint|verb|Description
--|---|---
/todos|POST| Creates a new TODO
/todos|GET| Gets all TODOS
/todos/:todo_id|GET| Get a single TODO by id
/todos/:todo_id|PUT| Updates a Todo
/todos/:todo_id|DELETE| Deletes a single todo

To test this api use [todo-api.postman_collection](examples/basic/todo-api.postman_collection.json)

[You can check the example Here](examples/basic/README.md)

# Advanced Example(Points of interest)

The advanced example uses *node-lite-router* to publish the endpoints of the api, and basically represents a points of interest api(POI).

Endpoint|verb|Description
--|---|---
/v1/points-of-interest|POST|Creates a point of interest
/v1/points-of-interest|GET|Gets all the points of interest in a paginated fashion
/v1/points-of-interest/:poi_id|PUT| Updates a point of interest
/v1/points-of-interest/:poi_id|DELETE| Deletes a point of interest
/v1/points-of-interest/:poi_id|GET| Finds a particular a point of interest

To test this api use [poi-api.postman_collection](examples/advanced/poi-api.postman_collection.json)

[You can check the example Here](examples/advanced/README.md)
# Why sequelize-resource-controller(My motivations)?

When writing CRUD based REST Apis with a relational database backend, you'll often find yourself loosing time with some stuff like implementing transactions, writing validations, and just every step possible to convert your database model into an Resource representation. 

This module will make sure your code looks standarized and CRUD looks like a trivial thing.

This also addresses to reach the Richardson's Rest Maturity Model by implementing for you the fancy parts(Basically the Verbs, the status codes, and the Hateoas stuff). 

This module also uses google API design in terms of resource responses, error handling and internal service names(with the exception of our **delete** reserved word :P).

# Notes

* This is the second module of a series of node-modules that I am creating with the main goal of creating node based microservices stacks. This will address the Relational database CRUD APi approach with some *database per service around here*.

* It was based on a module that I've previously coded back in 2016, this module has a cleaner way of doing things and has less messy parts. It allows you to take more control on some things. Also has support for restify wich is cool.

* This module was written using async/await so you it is easier to handle the tricky parts.

* This module has some cool eslinting around.

# ROADMAP

* I18N support:  Will be cool and nice to have translation messages for the supported errors and responses.

* Extensible support for List endpoint: Basically override the findAll params to include associations or something like that.

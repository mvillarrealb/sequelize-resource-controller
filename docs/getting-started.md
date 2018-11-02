# Getting Started

The following steps will help you on getting started on sequelize-resource-controller.

## Install The module

```javascript
npm install --save sequelize-resource-controller
```

## Create your database models

Sequelize Resource controller needs a sequelize instance and your database models to convert them into resources.

The following is a recommended practice to use


## Choose an implementation

To choose an implementation you just have to extract it from the module
itself, whether you are using object property deconstructing or plain 
property access

### Choose Express Implementation

```javascript
const { express } = require('sequelize-resource-controller');
//OR
const expressController = require('sequelize-resource-controller').express;
```

### Choose Restify Implementation

```javascript
const { restify } = require('sequelize-resource-controller');
//OR
const restifyController = require('sequelize-resource-controller').restify;
```
### Choose Raw Implementation

```javascript
const { resourceController } = require('sequelize-resource-controller');
//OR
const resourceController = require('sequelize-resource-controller').resourceController;
```
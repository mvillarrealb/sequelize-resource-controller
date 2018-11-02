module.exports = {
  "extends": ["airbnb", "prettier"],
  "plugins": ["prettier", "mocha"],
  "rules": {
    "prettier/prettier": ["error"],
    "class-methods-use-this": "off",
    "arrow-body-style": "off"
  },
  "env": {
    "node": true,
    "mocha": true,
    "es6": true
  }
};
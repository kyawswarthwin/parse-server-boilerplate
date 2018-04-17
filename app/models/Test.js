'use strict';

const Model = require('../../database/model');

class Test extends Model {
  constructor() {
    super('Test');
  }
}

module.exports = Test;

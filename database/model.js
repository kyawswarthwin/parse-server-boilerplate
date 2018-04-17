'use strict';

const path = require('path');
const fs = require('fs');

class Model extends Parse.Object {
  constructor(className) {
    super(className);

    try {
      const schemasPath = path.join(__dirname, 'schemas');
      fs.readdirSync(schemasPath).forEach(file => {
        if (path.extname(file) === '.js' && file !== 'schemas.js') {
          const schema = require(path.join(schemasPath, file));
          if (schema.className === className) {
            Object.keys(schema.fields).forEach(key => {
              Object.defineProperty(Model.prototype, key, {
                get() {
                  return this.get(key);
                },
                set(value) {
                  this.set(key, value);
                }
              });
            });
          }
        }
      });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

module.exports = Model;

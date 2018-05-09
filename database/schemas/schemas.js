'use strict';

const path = require('path');
const fs = require('fs');

try {
  fs.readdirSync(__dirname).forEach(async file => {
    if (path.extname(file).toLowerCase() === '.js' && file !== 'schemas.js') {
      const schema = require(path.join(__dirname, file));
      const _schema = new Parse.Schema(schema.className);
      _schema._fields = schema.fields;
      _schema._indexes = schema.indexes;
      await _schema.save();
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

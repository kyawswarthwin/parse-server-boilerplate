'use strict';

const fs = require('fs');
const path = require('path');

try {
  fs.readdirSync(__dirname).forEach(file => {
    if (path.extname(file).toLowerCase() === '.js' && file !== 'models.js') {
      const model = require(path.join(__dirname, file));
      Parse.Object.registerSubclass(model.name, model);
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

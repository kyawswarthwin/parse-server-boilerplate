'use strict';

const fs = require('fs');
const path = require('path');

try {
  fs.readdirSync(__dirname).forEach(file => {
    if (path.extname(file).toLowerCase() === '.js' && file !== 'triggers.js') {
      const triggers = require(path.join(__dirname, file));
      Object.keys(triggers).forEach(key => {
        if (Parse.Cloud.hasOwnProperty(key)) {
          Parse.Cloud[key](triggers.className, triggers[key]);
        }
      });
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

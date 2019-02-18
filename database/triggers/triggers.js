'use strict';

const fs = require('fs');
const path = require('path');
const { ParseCloudClass } = require('parse-server-addon-cloud-class');

try {
  fs.readdirSync(__dirname).forEach(file => {
    if (path.extname(file).toLowerCase() === '.js' && file !== 'triggers.js') {
      const triggers = require(path.join(__dirname, file));
      ParseCloudClass.configureClass(Parse, triggers.className, new ParseCloudClass(triggers));
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

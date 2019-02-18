'use strict';

const fs = require('fs');
const path = require('path');
const api = require('../../cloud/utils/api');

try {
  fs.readdirSync(__dirname).forEach(async file => {
    if (path.extname(file).toLowerCase() === '.js' && file !== 'schemas.js') {
      const schema = require(path.join(__dirname, file));
      await api(`/schemas/${schema.className}`, 'POST');
      await api(`/schemas/${schema.className}`, 'PUT', schema);
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

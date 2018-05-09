'use strict';

const path = require('path');
const fs = require('fs');

try {
  fs.readdirSync(__dirname).forEach(file => {
    if (path.extname(file).toLowerCase() === '.js' && file !== 'functions.js') {
      const functions = require(path.join(__dirname, file));
      Object.keys(functions).forEach(key => {
        Parse.Cloud.define(key, functions[key]);
      });
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

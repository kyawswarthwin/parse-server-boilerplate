'use strict';

const path = require('path');
const fs = require('fs');

try {
  fs.readdirSync(__dirname).forEach(file => {
    if (path.extname(file).toLowerCase() === '.js' && file !== 'jobs.js') {
      const jobs = require(path.join(__dirname, file));
      Object.keys(jobs).forEach(key => {
        Parse.Cloud.job(key, jobs[key]);
      });
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

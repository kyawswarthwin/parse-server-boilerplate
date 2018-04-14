'use strict';
const path = require('path');
const fs = require('fs');

// Cloud Functions
(function() {
  try {
    fs.readdirSync(path.join(__dirname, 'functions')).forEach(file => {
      if (path.extname(file) === '.js') {
        const functions = require(path.join(__dirname, 'functions', file));
        Object.keys(functions).forEach(key => {
          Parse.Cloud.define(key, functions[key]);
        });
      }
    });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
})();

// Cloud Jobs
(function() {
  try {
    fs.readdirSync(path.join(__dirname, 'jobs')).forEach(file => {
      if (path.extname(file) === '.js') {
        const jobs = require(path.join(__dirname, 'jobs', file));
        Object.keys(jobs).forEach(key => {
          Parse.Cloud.job(key, jobs[key]);
        });
      }
    });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
})();

// Triggers
(function() {
  try {
    fs.readdirSync(path.join(__dirname, 'triggers')).forEach(file => {
      if (path.extname(file) === '.js') {
        const triggers = require(path.join(__dirname, 'triggers', file));
        Object.keys(triggers).forEach(key => {
          const className = path.basename(file, '.js');
          switch (key) {
            case 'beforeSave':
              Parse.Cloud.beforeSave(className, triggers[key]);
              break;
            case 'afterSave':
              Parse.Cloud.afterSave(className, triggers[key]);
              break;
            case 'beforeDelete':
              Parse.Cloud.beforeDelete(className, triggers[key]);
              break;
            case 'afterDelete':
              Parse.Cloud.afterDelete(className, triggers[key]);
              break;
            case 'beforeFind':
              Parse.Cloud.beforeFind(className, triggers[key]);
              break;
            case 'afterFind':
              Parse.Cloud.afterFind(className, triggers[key]);
              break;
            default:
              break;
          }
        });
      }
    });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
})();

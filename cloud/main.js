'use strict';

const path = require('path');
const fs = require('fs');

// Cloud Functions
{
  try {
    const functionsPath = path.join(__dirname, 'functions');
    fs.readdirSync(functionsPath).forEach(file => {
      if (path.extname(file) === '.js') {
        const functions = require(path.join(functionsPath, file));
        Object.keys(functions).forEach(key => {
          Parse.Cloud.define(key, functions[key]);
        });
      }
    });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

// Cloud Jobs
{
  try {
    const jobsPath = path.join(__dirname, 'jobs');
    fs.readdirSync(jobsPath).forEach(file => {
      if (path.extname(file) === '.js') {
        const jobs = require(path.join(jobsPath, file));
        Object.keys(jobs).forEach(key => {
          Parse.Cloud.job(key, jobs[key]);
        });
      }
    });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

// Triggers
{
  try {
    const triggersPath = path.join(__dirname, 'triggers');
    fs.readdirSync(triggersPath).forEach(file => {
      if (path.extname(file) === '.js') {
        const triggers = require(path.join(triggersPath, file));
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
}

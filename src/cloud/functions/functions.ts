import * as fs from 'fs';
import * as path from 'path';

try {
  fs.readdirSync(__dirname).forEach(async file => {
    if (path.extname(file).toLowerCase() === '.js' && file !== 'functions.js') {
      const functions = await import(path.join(__dirname, file));
      Object.keys(functions).forEach(key => {
        Parse.Cloud.define(key, functions[key]);
      });
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

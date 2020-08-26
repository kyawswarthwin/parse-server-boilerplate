import { readdirSync } from 'fs';
import { extname, join } from 'path';

try {
  readdirSync(__dirname).forEach(async file => {
    if (extname(file).toLowerCase() === '.js' && file !== 'functions.js') {
      const functions = await import(join(__dirname, file));
      Object.keys(functions).forEach(key => {
        Parse.Cloud.define(key, functions[key]);
      });
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

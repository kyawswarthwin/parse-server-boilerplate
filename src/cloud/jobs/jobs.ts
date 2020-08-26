import * as fs from 'fs';
import * as path from 'path';

try {
  fs.readdirSync(__dirname).forEach(async file => {
    if (path.extname(file).toLowerCase() === '.js' && file !== 'jobs.js') {
      const jobs = await import(path.join(__dirname, file));
      Object.keys(jobs).forEach(key => {
        Parse.Cloud.job(key, jobs[key]);
      });
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

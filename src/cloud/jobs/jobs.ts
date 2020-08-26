import { readdirSync } from 'fs';
import { extname, join } from 'path';

try {
  readdirSync(__dirname).forEach(async file => {
    if (extname(file).toLowerCase() === '.js' && file !== 'jobs.js') {
      const jobs = await import(join(__dirname, file));
      Object.keys(jobs).forEach(key => {
        Parse.Cloud.job(key, jobs[key]);
      });
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

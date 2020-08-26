import { readdirSync } from 'fs';
import { extname, join } from 'path';
import { ParseCloudClass } from 'parse-server-addon-cloud-class';

try {
  readdirSync(__dirname).forEach(async file => {
    if (extname(file).toLowerCase() === '.js' && file !== 'triggers.js') {
      const triggers = await import(join(__dirname, file));
      Object.keys(triggers).forEach(key => {
        ParseCloudClass.configureClass(Parse, key, new triggers[key]());
      });
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

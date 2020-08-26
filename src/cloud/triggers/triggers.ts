'use strict';

import * as fs from 'fs';
import * as path from 'path';
import { ParseCloudClass } from 'parse-server-addon-cloud-class';

declare const Parse;

try {
  fs.readdirSync(__dirname).forEach(async file => {
    if (path.extname(file).toLowerCase() === '.js' && file !== 'triggers.js') {
      const triggers = await import(path.join(__dirname, file));
      Object.keys(triggers).forEach(key => {
        ParseCloudClass.configureClass(Parse, key, new triggers[key]());
      });
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

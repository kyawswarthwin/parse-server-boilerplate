'use strict';

const fs = require('fs');
const path = require('path');

try {
  fs.readdirSync(__dirname).forEach(async file => {
    if (path.extname(file).toLowerCase() === '.js' && file !== 'seeds.js') {
      const seed = require(path.join(__dirname, file));
      const query = new Parse.Query(seed.className);
      const count = await query.count();
      if (count === 0) {
        const Object = Parse.Object.extend(seed.className);
        seed.attributes.forEach(async attribute => {
          const object = new Object();
          if (attribute.permissions) {
            object.setACL(new Parse.ACL(attribute.permissions));
            delete attribute.permissions;
          }
          await object.save(attribute);
        });
      }
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

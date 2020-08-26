import { readdirSync } from 'fs';
import { extname, join } from 'path';

export interface Trigger {
  beforeFind(req: Parse.Cloud.BeforeFindRequest): void;

  afterFind(req: Parse.Cloud.AfterFindRequest): void;

  beforeSave(req: Parse.Cloud.BeforeSaveRequest): void;

  afterSave(req: Parse.Cloud.AfterSaveRequest): void;

  beforeDelete(req: Parse.Cloud.BeforeDeleteRequest): void;

  afterDelete(req: Parse.Cloud.AfterDeleteRequest): void;
}

export function requireLogin(
  req:
    | Parse.Cloud.BeforeFindRequest
    | Parse.Cloud.BeforeSaveRequest
    | Parse.Cloud.BeforeDeleteRequest,
) {
  if (!req.user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'Insufficient auth.');
  }
}

try {
  readdirSync(__dirname).forEach(async file => {
    if (extname(file).toLowerCase() === '.js' && file !== 'triggers.js') {
      const triggers = await import(join(__dirname, file));
      Object.keys(triggers).forEach(key => {
        const obj = new triggers[key]();
        Parse.Cloud.beforeFind(key, obj.beforeFind);
        Parse.Cloud.afterFind(key, obj.afterFind);
        Parse.Cloud.beforeSave(key, obj.beforeSave);
        Parse.Cloud.afterSave(key, obj.afterSave);
        Parse.Cloud.beforeDelete(key, obj.beforeDelete);
        Parse.Cloud.afterDelete(key, obj.afterDelete);
      });
    }
  });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

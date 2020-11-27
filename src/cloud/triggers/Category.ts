import { BeforeSaveTrigger } from './triggers';
import { uniqueKeys } from '../utils/common';

export class Category implements BeforeSaveTrigger {
  async beforeSave(req: Parse.Cloud.BeforeSaveRequest): Promise<void> {
    const { object } = req;

    if (object.existed()) {
      return;
    }
    await uniqueKeys(req, ['name']);

    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    object.setACL(acl);
  }
}

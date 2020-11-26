import { BeforeSaveTrigger } from './triggers';
import { uniqueKeys } from '../utils/common';

export class Category implements BeforeSaveTrigger {
  async beforeSave(req: Parse.Cloud.BeforeSaveRequest): Promise<void> {
    const { object } = req;
    if (object.existed()) {
      return;
    }

    await uniqueKeys(req, ['name']);

    const ACL = new Parse.ACL();
    ACL.setPublicReadAccess(true);
    ACL.setPublicWriteAccess(false);
    object.setACL(ACL);
  }
}

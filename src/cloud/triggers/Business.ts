import {
  BeforeSaveTrigger,
  AfterSaveTrigger,
  AfterDeleteTrigger,
} from './triggers';
import { requireLogin, uniqueKeys } from '../utils/common';

export class Business
  implements BeforeSaveTrigger, AfterSaveTrigger, AfterDeleteTrigger {
  async beforeSave(req: Parse.Cloud.BeforeSaveRequest): Promise<void> {
    requireLogin(req);
    await uniqueKeys(req, ['pageId']);
  }

  async afterSave(req: Parse.Cloud.AfterSaveRequest): Promise<void> {
    const { user, object } = req;
    if (object.existed()) {
      return;
    }

    const acl = new Parse.ACL();
    acl.setRoleReadAccess(`${object.id}_admin`, true);
    acl.setRoleWriteAccess(`${object.id}_admin`, true);

    const adminRole = new Parse.Role(`${object.id}_admin`, acl);
    adminRole.getUsers().add(user);
    adminRole.set('business', object);
    await adminRole.save();

    const operatorRole = new Parse.Role(`${object.id}_operator`, acl);
    operatorRole.getRoles().add(adminRole);
    operatorRole.set('business', object);
    await operatorRole.save();

    object.setACL(acl);
    await object.save(
      {},
      {
        useMasterKey: true,
      },
    );
  }

  async afterDelete(req: Parse.Cloud.AfterDeleteRequest): Promise<void> {
    const query = new Parse.Query(Parse.Role);
    query.equalTo('business', req.object);
    const roles = await query.find({
      useMasterKey: true,
    });
    Promise.all(
      roles.map(async role => {
        await role.destroy({
          useMasterKey: true,
        });
      }),
    );
  }
}

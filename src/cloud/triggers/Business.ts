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

    const adminACL = new Parse.ACL();
    adminACL.setRoleReadAccess(`${object.id}_admin`, true);
    adminACL.setRoleWriteAccess(`${object.id}_admin`, true);
    const adminRole = new Parse.Role(`${object.id}_admin`, adminACL);
    adminRole.getUsers().add(user);
    adminRole.set('business', object);
    await adminRole.save();

    const operatorACL = new Parse.ACL();
    operatorACL.setRoleReadAccess(`${object.id}_admin`, true);
    operatorACL.setRoleReadAccess(`${object.id}_operator`, true);
    operatorACL.setRoleWriteAccess(`${object.id}_admin`, true);
    const operatorRole = new Parse.Role(`${object.id}_operator`, operatorACL);
    operatorRole.getRoles().add(adminRole);
    operatorRole.set('business', object);
    await operatorRole.save();

    object.setACL(operatorACL);
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

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

    const moderatorACL = new Parse.ACL();
    moderatorACL.setRoleReadAccess(`${object.id}_admin`, true);
    moderatorACL.setRoleReadAccess(`${object.id}_moderator`, true);
    moderatorACL.setRoleWriteAccess(`${object.id}_admin`, true);
    const moderatorRole = new Parse.Role(
      `${object.id}_moderator`,
      moderatorACL,
    );
    moderatorRole.getRoles().add(adminRole);
    moderatorRole.set('business', object);
    await moderatorRole.save();

    const memberACL = new Parse.ACL();
    memberACL.setRoleReadAccess(`${object.id}_admin`, true);
    memberACL.setRoleReadAccess(`${object.id}_moderator`, true);
    memberACL.setRoleReadAccess(`${object.id}_member`, true);
    memberACL.setRoleWriteAccess(`${object.id}_admin`, true);
    memberACL.setRoleWriteAccess(`${object.id}_moderator`, true);
    const memberRole = new Parse.Role(`${object.id}_member`, memberACL);
    memberRole.getRoles().add(moderatorRole);
    memberRole.set('business', object);
    await memberRole.save();

    object.setACL(moderatorACL);
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

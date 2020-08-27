import { BeforeSaveTrigger, requireLogin, AfterSaveTrigger } from './triggers';

export class Business implements BeforeSaveTrigger, AfterSaveTrigger {
  beforeSave(req: Parse.Cloud.BeforeSaveRequest): void {
    requireLogin(req);
  }

  async afterSave(req: Parse.Cloud.AfterSaveRequest): Promise<void> {
    const { user, object } = req;
    if (object.existed()) {
      return;
    }

    const roleACL = new Parse.ACL();
    roleACL.setRoleReadAccess(`${object.id}_admin`, true);
    roleACL.setRoleWriteAccess(`${object.id}_admin`, true);

    const adminRole = new Parse.Role(`${object.id}_admin`, roleACL);
    adminRole.getUsers().add(user);
    adminRole.set('business', object);
    await adminRole.save();

    const operatorRole = new Parse.Role(`${object.id}_operator`, roleACL);
    operatorRole.getRoles().add(adminRole);
    operatorRole.set('business', object);
    await operatorRole.save();

    const businessACL = new Parse.ACL();
    businessACL.setPublicReadAccess(true);
    businessACL.setRoleWriteAccess(`${object.id}_admin`, true);
    object.setACL(businessACL);
    await object.save(
      {},
      {
        useMasterKey: true,
      },
    );
  }
}

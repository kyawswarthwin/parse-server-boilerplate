import { BeforeSaveTrigger, requireLogin, AfterSaveTrigger } from './triggers';

export class Business implements BeforeSaveTrigger, AfterSaveTrigger {
  beforeSave(req: Parse.Cloud.BeforeSaveRequest): void {
    requireLogin(req);

    const business = req.object;
    if (business.existed()) {
      return;
    }

    const relation = business.relation('users');
    relation.add(req.user);
  }

  async afterSave(req: Parse.Cloud.BeforeSaveRequest): Promise<void> {
    const business = req.object;
    if (business.existed()) {
      return;
    }

    const roleACL = new Parse.ACL();
    roleACL.setPublicReadAccess(true);

    const adminRole = new Parse.Role(`${business.id}_admin`, roleACL);
    adminRole.getUsers().add(req.user);
    await adminRole.save();

    const operatorRole = new Parse.Role(`${business.id}_operator`, roleACL);
    operatorRole.getRoles().add(adminRole);
    await operatorRole.save();

    const businessACL = new Parse.ACL();
    businessACL.setPublicReadAccess(true);
    businessACL.setRoleWriteAccess(adminRole, true);
    business.setACL(businessACL);
    await business.save(
      {},
      {
        useMasterKey: true,
      },
    );
  }
}

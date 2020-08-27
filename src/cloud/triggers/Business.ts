import { BeforeSaveTrigger, requireLogin, AfterSaveTrigger } from './triggers';

export class Business implements BeforeSaveTrigger, AfterSaveTrigger {
  beforeSave(req: Parse.Cloud.BeforeSaveRequest): void {
    requireLogin(req);

    const business = req.object;

    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    business.setACL(acl);

    const relation = business.relation('users');
    relation.add(req.user);
  }

  async afterSave(req: Parse.Cloud.BeforeSaveRequest): Promise<void> {
    const business = req.object;

    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);

    const adminRole = new Parse.Role(`${business.id}_admin`, acl);
    adminRole.getUsers().add(req.user);
    await adminRole.save();

    const operatorRole = new Parse.Role(`${business.id}_operator`, acl);
    operatorRole.getRoles().add(adminRole);
    await operatorRole.save();
  }
}

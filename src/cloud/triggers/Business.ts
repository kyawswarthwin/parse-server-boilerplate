import { BeforeSaveTrigger, requireLogin } from './triggers';

export class Business implements BeforeSaveTrigger {
  beforeSave(req: Parse.Cloud.BeforeSaveRequest): void {
    requireLogin(req);

    const relation = req.object.relation('users');
    relation.add(req.user);
  }
}

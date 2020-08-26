import { BeforeSaveTrigger, requireLogin } from './triggers';

export class Test implements BeforeSaveTrigger {
  beforeSave(req: Parse.Cloud.BeforeSaveRequest): void {
    requireLogin(req);
  }
}

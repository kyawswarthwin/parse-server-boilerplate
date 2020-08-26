/* eslint-disable @typescript-eslint/no-empty-function */
import { Trigger, requireLogin } from './triggers';

export class Test implements Trigger {
  beforeFind(req: Parse.Cloud.BeforeFindRequest): void {}
  afterFind(req: Parse.Cloud.AfterFindRequest): void {}
  beforeSave(req: Parse.Cloud.BeforeSaveRequest): void {
    requireLogin(req, true);
  }
  afterSave(req: Parse.Cloud.AfterSaveRequest): void {}
  beforeDelete(req: Parse.Cloud.BeforeDeleteRequest): void {}
  afterDelete(req: Parse.Cloud.AfterDeleteRequest): void {}
}

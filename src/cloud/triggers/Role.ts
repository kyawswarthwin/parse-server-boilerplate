import { AfterSaveTrigger } from './triggers';

export class _Role implements AfterSaveTrigger {
  async afterSave(req: Parse.Cloud.AfterSaveRequest): Promise<void> {
    const { object } = req;

    const role = await object.fetch({
      useMasterKey: true,
    });
    const business = await role.get('business').fetch({
      useMasterKey: true,
    });

    const relation = role.relation('users');
    const query = relation.query();
    const users = await query.find();

    await Promise.all(
      users.map(async user => {
        const relation = business.relation('users');
        relation.add(user);
        await business.save(
          {},
          {
            useMasterKey: true,
          },
        );
      }),
    );
  }
}

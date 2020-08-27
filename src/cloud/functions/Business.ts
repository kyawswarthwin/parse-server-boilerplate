import { requireLogin } from '../utils/common';

export async function getUserBusinesses(req) {
  requireLogin(req);

  const roles = await new Parse.Query(Parse.Role)
    .equalTo('users', req.user)
    .include('business')
    .find({
      useMasterKey: true,
    });
  const businesses = roles.map(role => role.get('business'));

  return businesses;
}

export async function assignBusinessRole(req) {
  const { businessId, userId, roleId } = req.params;

  const Business = Parse.Object.extend('Business');
  const business = new Business();
  business.id = businessId;
  await business.fetch({
    useMasterKey: true,
  });

  const User = Parse.Object.extend('_User');
  const user = new User();
  user.id = userId;
  await user.fetch({
    useMasterKey: true,
  });

  const Role = Parse.Object.extend('_Role');
  const role = new Role();
  role.id = roleId;
  await role.fetch({
    useMasterKey: true,
  });

  business.relation('users').add(user);
  await business.save(
    {},
    {
      useMasterKey: true,
    },
  );

  role.relation('users').add(user);
  await role.save(
    {},
    {
      useMasterKey: true,
    },
  );
}

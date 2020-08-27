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
  const { business, user, role } = req.params;

  return {
    business,
    user,
    role,
  };
}

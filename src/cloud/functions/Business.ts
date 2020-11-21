export async function getBusinessRoles(req) {
  const { businessId } = req.params;

  const Business = Parse.Object.extend('Business');
  const business = new Business();
  business.id = businessId;

  const roles = await new Parse.Query(Parse.Role)
    .equalTo('business', business)
    .find({
      useMasterKey: true,
    });

  return roles;
}

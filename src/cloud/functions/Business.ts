export function getBusinessRoles(req) {
  const { businessId } = req.params;
  const Business = Parse.Object.extend('Business');
  const business = new Business();
  business.id = businessId;
  const query = new Parse.Query(Parse.Role);
  query.equalTo('business', business);
  return query.find({
    useMasterKey: true,
  });
}

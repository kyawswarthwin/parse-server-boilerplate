export function requireLogin(
  req:
    | Parse.Cloud.BeforeFindRequest
    | Parse.Cloud.BeforeSaveRequest
    | Parse.Cloud.BeforeDeleteRequest,
) {
  if (!req.master && !req.user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'Insufficient auth.');
  }
}

export async function uniqueKeys(
  req:
    | Parse.Cloud.BeforeFindRequest
    | Parse.Cloud.BeforeSaveRequest
    | Parse.Cloud.BeforeDeleteRequest,
  keys: string[],
) {
  const { object } = req;

  if (object.existed()) {
    return;
  }

  const queries = keys.map(key => {
    return new Parse.Query(object.className).equalTo(key, object.get(key));
  });
  const query = Parse.Query.or(...queries);
  const count = await query.count({
    useMasterKey: true,
  });
  if (count > 0) {
    throw new Parse.Error(
      Parse.Error.DUPLICATE_VALUE,
      'A duplicate value for a field with unique values was provided.',
    );
  }
}

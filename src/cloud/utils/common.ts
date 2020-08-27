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

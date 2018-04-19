'use strict';

const urlJoin = require('url-join');

function parseServerRequest(endpoint, method, useMasterKey) {
  const headers = {
    'X-Parse-Application-Id': Parse.applicationId
  };
  if (useMasterKey) headers['X-Parse-Master-Key'] = Parse.masterKey;
  const url = urlJoin(Parse.serverURL, endpoint);
  return Parse.Cloud.httpRequest({
    url: url,
    method: method,
    headers: headers
  });
}

module.exports = parseServerRequest;

'use strict';

const urlJoin = require('url-join');

function api(path, method = 'GET', params = undefined) {
  return Parse.Cloud.httpRequest({
    url: urlJoin(Parse.serverURL, path),
    method: method,
    headers: {
      'X-Parse-Application-Id': Parse.applicationId,
      'X-Parse-Master-Key': Parse.masterKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
}

module.exports = api;

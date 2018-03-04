'use strict';
const http = require('http');
const express = require('express');
const responseTime = require('response-time');
const compression = require('compression');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');

const app = express();
const port = process.env.PORT || 1337;

const appName = 'Parse Server Boilerplate';

const mountPath = process.env.PARSE_MOUNT || '/parse';
const api = new ParseServer({
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || 'myMasterKey',
  databaseURI: process.env.MONGO_URL || 'mongodb://localhost:27017/dev',
  // Cloud Code
  serverURL: process.env.SERVER_URL || `http://localhost:${port}${mountPath}`,
  cloud: path.join(__dirname, 'cloud/main.js'),
  // Live Queries
  liveQuery: {
    classNames: []
  },
  // Storage
  filesAdapter: {
    module: '@parse/s3-files-adapter',
    options: {
      directAccess: true
    }
  },
  // Email Verification & Password Reset
  verifyUserEmails: true,
  appName: appName,
  publicServerURL: process.env.SERVER_URL || `http://localhost:${port}${mountPath}`,
  emailAdapter: {
    module: '@parse/simple-mailgun-adapter',
    options: {
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      fromAddress: `no-reply@${process.env.MAILGUN_DOMAIN.split('.')
        .splice(1)
        .join('.')}`
    }
  },
  // Security
  passwordPolicy: {
    validatorPattern: /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]).{6,}$/,
    doNotAllowUsername: true,
    maxPasswordHistory: 5,
    resetTokenValidityDuration: 24 * 60 * 60
  },
  accountLockout: {
    threshold: 3,
    duration: 5
  },
  allowClientClassCreation: process.env.NODE_ENV === 'production' ? false : true
});

app.use(responseTime());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(mountPath, api);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
ParseServer.createLiveQueryServer(server);

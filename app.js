'use strict';

require('dotenv').config();
const http = require('http');
const express = require('express');
const responseTime = require('response-time');
const compression = require('compression');
const cors = require('cors');
const { ParseServer } = require('parse-server');
const ParseDashboard = require('parse-dashboard');
const path = require('path');

const app = express();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 1337;
const mountPath = process.env.PARSE_MOUNT || '/parse';

const appName = 'Parse Server Boilerplate';
const appId = process.env.APP_ID || 'myAppId';
const masterKey = process.env.MASTER_KEY || 'myMasterKey';
const serverURL = process.env.SERVER_URL || `http://${host}:${port}${mountPath}`;

const api = new ParseServer({
  appId: appId,
  masterKey: masterKey,
  databaseURI:
    process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    process.env.DATABASE_URL ||
    'mongodb://localhost:27017/dev',
  // Cloud Code
  serverURL: serverURL,
  cloud: path.join(__dirname, 'cloud/main.js'),
  // Live Queries
  liveQuery: {
    classNames: []
  },
  // // Storage
  // filesAdapter: {
  //   module: '@parse/s3-files-adapter',
  //   options: {
  //     directAccess: true
  //   }
  // },
  // // Email Verification & Password Reset
  // verifyUserEmails: true,
  // appName: appName,
  // publicServerURL: serverURL,
  // emailAdapter: {
  //   module: '@parse/simple-mailgun-adapter',
  //   options: {
  //     apiKey: process.env.MAILGUN_API_KEY,
  //     domain: process.env.MAILGUN_DOMAIN,
  //     fromAddress: `no-reply@${process.env.MAILGUN_DOMAIN.split('.')
  //       .splice(1)
  //       .join('.')}`
  //   }
  // },
  // // Security
  // passwordPolicy: {
  //   validatorPattern: /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]).{6,}$/,
  //   doNotAllowUsername: true,
  //   maxPasswordHistory: 5,
  //   resetTokenValidityDuration: 24 * 60 * 60
  // },
  // accountLockout: {
  //   threshold: 3,
  //   duration: 5
  // },
  allowClientClassCreation: process.env.NODE_ENV === 'production' ? false : true
});

const dashboard = new ParseDashboard(
  {
    apps: [
      {
        appId: appId,
        masterKey: masterKey,
        serverURL: serverURL,
        appName: appName
      }
    ],
    users: [
      {
        user: process.env.PARSE_DASHBOARD_USER_ID || 'admin',
        pass: process.env.PARSE_DASHBOARD_USER_PASSWORD || 'admin'
      }
    ]
  },
  {
    allowInsecureHTTP: true
  }
);

app.use(responseTime());
app.use(compression());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(mountPath, api);
app.use('/dashboard', dashboard);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
ParseServer.createLiveQueryServer(server);

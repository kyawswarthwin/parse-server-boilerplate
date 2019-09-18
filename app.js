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
const constants = require('./config/constants');
const routes = require('./routes');

const app = express();

const api = new ParseServer({
  appId: constants.APP_ID,
  masterKey: constants.MASTER_KEY,
  databaseURI: constants.DATABASE_URI,
  // Cloud Code
  serverURL: constants.SERVER_URL,
  cloud: path.join(__dirname, 'cloud/main.js'),
  // Live Queries
  liveQuery: {
    classNames: [],
  },
  // // Storage
  // filesAdapter: {
  //   module: '@parse/s3-files-adapter',
  //   options: {
  //     directAccess: true,
  //   },
  // },
  // // Email Verification & Password Reset
  // verifyUserEmails: true,
  // appName: constants.APP_NAME,
  // publicServerURL: constants.SERVER_URL,
  // emailAdapter: {
  //   module: '@parse/simple-mailgun-adapter',
  //   options: {
  //     apiKey: process.env.MAILGUN_API_KEY,
  //     domain: process.env.MAILGUN_DOMAIN,
  //     fromAddress: `no-reply@${process.env.MAILGUN_DOMAIN.split('.')
  //       .splice(1)
  //       .join('.')}`,
  //   },
  // },
  // // Security
  // passwordPolicy: {
  //   validatorPattern: /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]).{6,}$/,
  //   doNotAllowUsername: true,
  //   maxPasswordHistory: 5,
  //   resetTokenValidityDuration: 24 * 60 * 60,
  // },
  // accountLockout: {
  //   threshold: 3,
  //   duration: 5,
  // },
  allowClientClassCreation: process.env.NODE_ENV === 'production' ? false : true,
});

const dashboard = new ParseDashboard(
  {
    apps: [
      {
        appId: constants.APP_ID,
        masterKey: constants.MASTER_KEY,
        serverURL: constants.SERVER_URL,
        appName: constants.APP_NAME,
      },
    ],
    users: [
      {
        user: constants.PARSE_DASHBOARD_USER_ID,
        pass: constants.PARSE_DASHBOARD_USER_PASSWORD,
      },
    ],
  },
  {
    allowInsecureHTTP: true,
  },
);

app.use(responseTime());
app.use(compression());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use(constants.PARSE_MOUNT, api);
app.use('/dashboard', dashboard);

const server = http.createServer(app);
server.listen(constants.PORT, () => {
  console.log(`Server running at http://${constants.HOST}:${constants.PORT}`);
});
ParseServer.createLiveQueryServer(server);

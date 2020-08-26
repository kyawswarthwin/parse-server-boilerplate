import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ParseServer } from 'parse-server';
import { join } from 'path';

import * as compression from 'compression';
import * as ParseDashboard from 'parse-dashboard';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);
  // Parse Server
  const api = new ParseServer({
    appId: configService.get('APP_ID'),
    masterKey: configService.get('MASTER_KEY'),
    databaseURI: configService.get('DATABASE_URI'),
    serverURL: configService.get('SERVER_URL'),
    serverStartComplete: () => {
      console.log(`Parse Server running at ${configService.get('SERVER_URL')}`);
    },
    // Cloud Code
    cloud: join(__dirname, 'cloud/main.js'),
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
    // appName: configService.get('APP_NAME'),
    // publicServerURL: configService.get('SERVER_URL'),
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
    allowClientClassCreation:
      process.env.NODE_ENV === 'production' ? false : true,
  });
  // Parse Dashboard
  const dashboard = new ParseDashboard(
    {
      apps: [
        {
          appId: configService.get('APP_ID'),
          masterKey: configService.get('MASTER_KEY'),
          serverURL: configService.get('SERVER_URL'),
          appName: configService.get('APP_NAME'),
        },
      ],
      users: [
        {
          user: configService.get('PARSE_DASHBOARD_USER_ID'),
          pass: configService.get('PARSE_DASHBOARD_USER_PASSWORD'),
        },
      ],
    },
    {
      allowInsecureHTTP: true,
    },
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('html');

  app.use(compression());
  app.use(configService.get('PARSE_MOUNT'), api);
  app.use('/dashboard', dashboard);

  await app.listen(configService.get('PORT'));
}
bootstrap();

import 'dotenv/config';

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { ParseServer } from 'parse-server';
import path from 'path';

(async () => {
  try {
    const {
      APP_ID = 'myAppId',
      MASTER_KEY = 'myMasterKey',
      DATABASE_URL,
      MONGO_URL,
      DATABASE_URI = DATABASE_URL ||
        MONGO_URL ||
        'mongodb://localhost:27017/dev',
      PORT = 1337,
      NODE_ENV,
    } = process.env;

    const app = express();

    const publicPath = path.join(__dirname, '..', 'public');

    const parseServer = new ParseServer({
      appId: APP_ID,
      masterKey: MASTER_KEY,
      masterKeyIps: ['0.0.0.0/0', '::/0'],
      databaseURI: DATABASE_URI,
      port: PORT,
      cloud: path.join(__dirname, 'cloud', 'main'),
      allowClientClassCreation: NODE_ENV !== 'production',
    });
    await parseServer.start();

    app.set('trust proxy', true);

    app.use(cors());
    app.use(compression());
    app.use(express.static(publicPath));
    app.use('/parse', parseServer.app);

    app.get('*', (req, res) => {
      res.sendFile(path.join(publicPath, 'index.html'));
    });

    const httpServer = http.createServer(app);
    httpServer.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}.`);
    });
    await ParseServer.createLiveQueryServer(httpServer);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

/* eslint-disable node/no-process-env */
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { GoogleConfig } from './GoogleConfig';

config();

const appRoot = path.dirname(path.dirname(__dirname));

function readSecret(file: string): string {
  return fs.readFileSync(path.join(appRoot, '.secrets', file)).toString();
}

export default {
  port: process.env.PORT || 5000,
  secret: <string>process.env.APP_SECRET,
  url: <string>process.env.APP_URL,
  auth0: {
    clientId: <string>process.env.AUTH0_CLIENT_ID,
    secret: <string>process.env.AUTH0_CLIENT_SECRET,
    domain: <string>process.env.AUTH0_DOMAIN,
  },
  google: {
    serviceAccount: <GoogleConfig>JSON.parse(readSecret('google.json')),
    adminUser: process.env.GOOGLE_ADMIN_USER,
    customerId: process.env.GOOGLE_CUSTOMER_ID,
    domain: process.env.GOOGLE_DOMAIN,
    org: process.env.GOOGLE_ORG,
  },
};

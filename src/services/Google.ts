import { google, admin_directory_v1 as googleSchemas } from 'googleapis';
import randomstring from 'randomstring';
import config from '../config';

const SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.user',
  'https://www.googleapis.com/auth/admin.directory.group.member',
];

export const auth = new google.auth.JWT(
  config.google.serviceAccount.client_email,
  undefined,
  config.google.serviceAccount.private_key,
  SCOPES,
  config.google.adminUser,
);

export const directoryApi = google.admin({ version: 'directory_v1', auth });

export async function allUsers(): Promise<googleSchemas.Schema$User[]> {
  let nextPageToken: string | undefined;
  const results = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    const { data } = await directoryApi.users.list({
      customer: config.google.customerId,
      maxResults: 500,
      pageToken: nextPageToken,
    });

    nextPageToken = data.nextPageToken ? <string>data.nextPageToken : undefined;

    if (Array.isArray(data.users)) {
      results.push(...<googleSchemas.Schema$User[]>data.users);
    }
  } while (typeof nextPageToken !== 'undefined');

  return results;
}

export async function createOrUpdateUser(
  username: string,
  givenName: string,
  familyName: string,
  phone: string,
  pronoun: string,
  title: string,
): Promise<void> {
  const email = `${username}@${config.google.domain}`;

  const profileInformation: googleSchemas.Schema$User = {
    name: {
      givenName,
      familyName,
    },
    phones: [
      {
        primary: true,
        type: 'main',
        value: phone,
      },
    ],
    organizations: [
      {
        domain: config.google.domain,
        name: config.google.org,
        title,
      },
    ],
  };

  const existingUser = await directoryApi.users.get({ userKey: email });
  if (existingUser) {
    await directoryApi.users.update({
      userKey: email,
      requestBody: profileInformation,
    });
  } else {
    await directoryApi.users.insert({
      requestBody: {
        primaryEmail: email,
        password: randomstring.generate({ length: 24 }),
        ...profileInformation,
      },
    });
  }
}

export async function changeUserPassword(
  username: string,
  password: string,
): Promise<void> {
  const email = `${username}@${config.google.domain}`;

  await directoryApi.users.update({
    userKey: email,
    requestBody: { password },
  });
}

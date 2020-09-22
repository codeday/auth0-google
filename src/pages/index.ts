import { Request, Response, Express } from 'express';
import { verify } from 'jsonwebtoken';
import config from '../config';
import { Auth0Token } from '../services/Auth0';
import { createOrUpdateUser } from '../services/Google';

async function indexPage(req: Request, res: Response): Promise<void> {
  const { token, state } = req.query;
  const { user } = <Auth0Token>verify(
    <string>token,
    <string>config.auth0.secret,
    {
      audience: config.auth0.clientId,
    },
  );
  const redirectUrl = `https://${config.auth0.domain}/continue?state=${state}`;

  await createOrUpdateUser(
    user.username,
    user.given_name,
    user.family_name,
    user.user_metadata.phone_number,
    user.user_metadata.pronoun,
    user.user_metadata.title,
  );

  res.send(`
  <html lang="en">
  <head>
    <title>CodeDay Google Account</title>
    <meta http-equiv="refresh" content="4; url=${redirectUrl}" />
  </head>
  <body>
    <div style="font-size: 1.3rem;text-align: center;max-width: 600px;margin: 2rem auto;">
      <h1>We're signing you in...</h1>
      <p><a href="${redirectUrl}">Click here if you're not redirected within 5 seconds.</a></p>
      <p>
        Note: some desktop apps require you to enter your Google password directly. This isn't synchronized with your
        CodeDay account, you must <a href="/pass">click here to set it.</a> (Most people don't need to do this.)
      </p>
    </div>
  </body>
  </html>
  `);
}

export default function registerPages(app: Express): void {
  app.get('/', indexPage);
}

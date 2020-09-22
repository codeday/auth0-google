import express from 'express';
import expressSession from 'express-session';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import bodyParser from 'body-parser';
import config from './config';
import registerIndex from './pages/index';
import registerPassword from './pages/password';
import { Auth0User } from './services/Auth0';

export default async function main(): Promise<void> {
  const app = express();
  app.use(bodyParser.urlencoded());
  app.use(expressSession({ secret: config.secret, resave: false, saveUninitialized: false }));
  const strategy = new Auth0Strategy({
    domain: config.auth0.domain,
    clientID: config.auth0.clientId,
    clientSecret: config.auth0.secret,
    callbackURL: `${config.url}/callback`,
  }, (_, __, ___, profile, done) => done(null, profile));

  passport.use(strategy);
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser((user, done) => {
    done(null, (<Auth0User>user).nickname);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  app.get('/login', passport.authenticate('auth0', { scope: 'openid email profile' }));
  app.get('/callback', passport.authenticate('auth0', { successRedirect: '/pass' }));

  registerIndex(app);
  registerPassword(app);

  // eslint-disable-next-line no-console
  app.listen(config.port, () => console.log(`Started at http://0.0.0.0:${config.port}`));
}

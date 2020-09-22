import {
  Request, Response, Express, Router, NextFunction,
} from 'express';
import { changeUserPassword } from '../services/Google';

const changePasswordPage = (req: Request, text?: string) => `
  <html lang="en">
  <head>
    <title>CodeDay Google Account</title>
  </head>
  <body>
    <form method="post" action="/pass" style="font-size: 1.3rem;text-align: center;max-width: 600px;margin: 2rem auto;">
      <h1>Change Your Google Account Password</h1>
      <p style="font-weight:bold">${text || ''}</p>
      Username: <input type="text" readonly value=${req.user} /><br />
      Password: <input type="password" name="password" value="" required /><br />
      <input type="submit">
    </div>
  </body>
  </html>
`;

async function showChangePasswordPage(req: Request, res: Response): Promise<void> {
  res.send(changePasswordPage(req));
}

async function doChangePassword(req: Request, res: Response): Promise<void> {
  try {
    await changeUserPassword(<string>req.user, req.body.password);
    res.send(changePasswordPage(req, 'Your Google account password was updated.'));
  } catch (err) {
    res.send(changePasswordPage(req, err));
  }
}

export default function registerPages(app: Express): void {
  const authenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.redirect('/login');
    }
    return next();
  };

  const router = Router();
  router.use(authenticateMiddleware);
  router.get('/', showChangePasswordPage);
  router.post('/', doChangePassword);

  app.use('/pass', router);
}

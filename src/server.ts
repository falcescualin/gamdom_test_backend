import validateEnv from '@utils/env.utils';

import App from './app';
import Routes from './routes';

try {
  validateEnv();

  const app = new App(new Routes());

  app.listen();
} catch (err) {
  console.error(err, err.stack);
}

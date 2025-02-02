import { INestApplication } from '@nestjs/common';

let app: INestApplication;

const setApp = (_app: INestApplication) => {
  console.log('Setting app');
  app = _app;
};

export { app, setApp };

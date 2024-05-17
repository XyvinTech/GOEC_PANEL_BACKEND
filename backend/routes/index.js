import authRouter from './auth.routes.js';
import stationRouter from './station.routes.js';

const routes = (app) => {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/station', stationRouter);
};

export default routes;

import express from 'express';
import * as authController from '../controllers/auth.controller.js';

const authRouter = express.Router({ mergeParams: true });

authRouter.route('/signup').post(authController.createAdmin);

authRouter.route('/login').post(authController.loginUser);

export default authRouter;

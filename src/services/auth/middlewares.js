import createError from 'http-errors';
import atob from 'atob';

import { verifyJWT } from './tools.js';
import userSchema from '../../models/userSchema.js';

export const JWTAuthMiddleware = async (req, res, next) => {
  // console.log(req.headers.authorization);

  if (!req.headers.authorization) {
    next(
      createError(
        401,
        'Please provide credentials in the Authorization header!'
      )
    );
  } else {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      const decodedToken = await verifyJWT(token);
      const user = await userSchema.findById(decodedToken._id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(createError(404, 'User not found!'));
      }
    } catch (error) {
      next(createError(401, 'Token Expired!'));
    }
  }
};

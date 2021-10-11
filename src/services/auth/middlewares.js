import createError from 'http-errors';
import atob from 'atob';

import { verifyJWT } from './tools.js';
import userSchema from '../../models/userSchema.js';

export const JWTAuthMiddleware = async (req, res, next) => {
  console.log('request headers', req.headers);
  if (!req.header.authorization) {
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

export const basicAuthMiddleware = async (req, res, next) => {
  console.log('req headers in basic auth', req.headers);
  if (!req.headers.authorization) {
    next(createError(401, 'Please provide credentials in the auth header'));
  } else {
    const decoded = atob(req.headers.authorization.split(' ')[1]);
    console.log(decoded);

    const [email, password] = decoded.split(':');
    const user = await userSchema.checkCredentials(email, password);
    if (user) {
      req.user = user;
      next();
    } else {
      next(createError(401, 'Credentials are not correct!'));
    }
  }
};

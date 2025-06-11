import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

export const authenticate = async (req, res, next) => {
  try {
      if(req.session.authenticate && req.session.userId){
            const user = await UserModel.findById(req.session.userId);
            if(user){
              req.user = user;
              return next();
            }
      }
          const token = req.cookie.token;

    // const authHeader = req.headers['authorization'];
    // const token = authHeader?.split(' ')[1];
    
    if (!token) {
      throw new Error('Authentication token missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }
req.session.userId = user.id;
req.session.authenticate=true;
    req.user = user;
    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      const error = new Error('Unauthorized access');
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};
import { RequestHandler, Request } from 'express';
import JWT from 'jsonwebtoken';
import config from '../config';
import { User } from '../entities/User';

export const authUser: RequestHandler = async (req: Request | any, res, next) => {
  const { authorization } = req.headers;

  if (!authorization?.startsWith('Bearer'))
    return res.status(401).json({
      error: true,
      message: 'Unauthorized access: Invalid token format',
    });

  const token = authorization.replace('Bearer ', '');

  if (!token)
    return res.status(401).json({
      error: true,
      message: 'Unauthorized access: Token not found',
    });

  try {
    const decodeToken = JWT.verify(token, config.SECRET_KEY as string);

    const user = await User.findOneBy({
      id: (decodeToken as User).id,
    });

    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized access: User does not exist',
      });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export const authAdmin: RequestHandler = async (req: Request | any, res, next) => {
  const { authorization } = req.headers;

  if (!authorization?.startsWith('Bearer'))
    return res.status(401).json({
      error: true,
      message: 'Unauthorized access: Invalid token format',
    });

  const token = authorization?.replace('Bearer ', '');

  if (!token)
    return res.status(401).json({
      error: true,
      message: 'Unauthorized access: Token not found',
    });

  try {
    const decodeToken = JWT.verify(token, process.env.SECRET_KEY as string);

    const user = await User.findOneBy({
      id: (decodeToken as User).id,
    });

    if (!user) {
      return res.status(401).json({ error: true, message: 'Unauthorized access: User does not exist' });
    }

    req.user = user;

    if (user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ error: true, message: 'Access denied!' });
    }
  } catch (error) {
    next(error);
  }
};

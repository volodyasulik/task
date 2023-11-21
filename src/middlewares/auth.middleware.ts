/* eslint-disable prefer-destructuring */
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { AppError } from '../utils/appError';
import { IUser } from '../types/user.type';

const signToken = (id: number) =>
  jwt.sign(
    {
      id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPORES_IN
    }
  );

export const createAndSendJWToken = (statusCode: number, user: IUser, res: Response) => {
  const token = signToken(user.id as number);
  const cookieOptions = {
    expires: new Date(Date.now() + +process.env.JWT_EXPIRATION * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    message: 'success',
    token,
    user
  });
};

export const Protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('Your are not not logged in! Please log in to get access', 401));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  if (typeof decoded === 'string') {
    return next(new AppError('JWT decoding failed', 401));
  }
  const [currentUser] = await User.find({ where: { id: decoded.id } });

  if (!currentUser) {
    return next(new AppError('The user beloning to this token does no longer exist', 401));
  }

  req.body.user = currentUser;

  next();
};

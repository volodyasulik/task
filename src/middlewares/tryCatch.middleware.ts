import { Request, Response, NextFunction } from 'express';

export const tryCatch = (func: Function) => (req: Request, res: Response, next: NextFunction) => {
  func(req, res, next).catch(next);
};

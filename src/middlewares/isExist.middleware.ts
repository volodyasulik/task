/* eslint-disable @typescript-eslint/indent */
import { Request, Response, NextFunction } from 'express';

import { BaseEntity, FindOptionsWhere } from 'typeorm';
import { AppError } from '../utils/appError';

export const isExist =
  <T extends BaseEntity>(repo: typeof BaseEntity) =>
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    if (req.params.id) {
      const [findEntity] = await repo.find({ where: { id: req.params.id } as unknown as FindOptionsWhere<T> });

      if (!findEntity) next(new AppError('Entity not found', 404));
      req.body.findEntity = findEntity;
    }
    next();
  };

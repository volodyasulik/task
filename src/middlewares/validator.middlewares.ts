import { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';

const userSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email({ tlds: { allow: ['com', 'net'] } }),
  phone: Joi.string().pattern(new RegExp('^\\+[0-9]{10}$')).allow(null),
  password: Joi.string()
});

const validateBody = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateUserBody = validateBody(userSchema);

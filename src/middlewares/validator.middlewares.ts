import { Request, Response, NextFunction } from "express";
import Joi, { Schema } from "joi";

const userSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email({ tlds: { allow: ["com", "net"] } }),
  phone: Joi.string().regex(
    /^(\+?\d{1,3}[\s.-]?\(?\d{1,3}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,9}[\s.-]?\d{1,9})$|^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  ),
  password: Joi.string(),
});

const validateBody =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };

export const validateUserBody = validateBody(userSchema);

import Joi from 'joi';

import { User } from '../entities/User';

export const ValidateUser = (userData: User) => {
  return Joi.object({
    username: Joi.string().min(3).max(20).trim().required(),
    email: Joi.string().required().email().normalize(),
    password: Joi.string().min(4).trim().required(),
  }).validate(userData);
};

export const ValidateAuth = (userData: User) => {
  return Joi.object({
    username: Joi.string().min(3).trim().required(),
    email: Joi.string().required().email().normalize(),
  }).validate(userData);
};

export const ValidateUserUpdate = (userData: User) => {
  return Joi.object({
    username: Joi.string().min(3).max(20).trim().required(),
    biography: Joi.optional(),
    email: Joi.string().required().email().normalize(),
  }).validate(userData);
};

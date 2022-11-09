import Joi from 'joi';

import { UserDoc } from '../libs/types';

export const ValidateUser = (userData: UserDoc) => {
  return Joi.object({
    username: Joi.string().min(3).max(20).trim().required(),
    email: Joi.string().required().email().normalize(),
    password: Joi.string().min(4).trim().required(),
  }).validate(userData);
};

export const ValidateAuth = (userData: UserDoc) => {
  return Joi.object({
    username: Joi.string().min(3).trim().required(),
    email: Joi.string().required().email().normalize(),
  }).validate(userData);
};

export const ValidateUserUpdate = (userData: UserDoc) => {
  return Joi.object({
    username: Joi.string().min(3).max(20).trim().required(),
    email: Joi.string().required().email().normalize(),
  }).validate(userData);
};

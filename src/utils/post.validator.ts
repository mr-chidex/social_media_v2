import Joi from 'joi';

import { PostDoc } from '../libs/types';

export const ValidatePost = (post: PostDoc) => {
  return Joi.object({
    content: Joi.string().min(3).trim().required(),
  }).validate(post);
};

export const ValidateComment = (post: PostDoc) => {
  return Joi.object({
    content: Joi.string().min(3).trim().required(),
    postId: Joi.string().trim().required(),
  }).validate(post);
};

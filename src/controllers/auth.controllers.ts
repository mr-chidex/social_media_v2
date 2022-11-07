import { RequestHandler } from 'express';

import { UserDoc } from '../libs/types';
import { ValidateUser } from '../utils/user.validators';
import { User } from '../entities/User';
import hashPassword from '../utils/hashPassword';

/**
 *
 * @route POST /api/v1/auth/register
 * @desc - register new user
 * @acces Public
 */
export const registerUser: RequestHandler = async (req, res) => {
  //validate request body
  console.log('body', req.body);
  const { error, value } = ValidateUser(req.body as UserDoc);

  if (error) return res.status(422).json({ message: error.details[0].message });

  const { username, email, password } = value as UserDoc;

  //check if username is already in use
  let userExist = await User.findOneBy({ username });

  console.log('isExist', userExist);
  if (userExist) return res.status(400).json({ message: 'username already in use', status: 'error' });

  //check if email is already in use
  userExist = await User.findOneBy({ email });
  if (userExist) return res.status(400).json({ message: 'email already in use', status: 'error' });

  //hash password
  const hashPass = await hashPassword(password);

  const user = new User();
  // const user = await User.create({
  user.username = username;
  user.email = email;
  user.password = hashPass;
  // });

  await user.save();

  res.status(201).json({ status: true, message: 'signup successful', data: null });
};

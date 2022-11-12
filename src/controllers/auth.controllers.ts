import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';

import { ValidateUser } from '../utils/user.validators';
import { User } from '../entities/User';
import hashPassword from '../utils/hashPassword';
import getToken from '../utils/getToken';

/**
 *
 * @route POST /api/v1/auth/register
 * @desc - register new user
 * @acces Public
 */
export const registerUser: RequestHandler = async (req, res) => {
  const { error, value } = ValidateUser(req.body as User);

  if (error)
    return res.status(422).json({
      error: true,
      message: error.details[0].message,
    });

  const { username, email, password } = value as User;

  //check if username is already in use
  let userExist = await User.findOneBy({ username });

  if (userExist)
    return res.status(400).json({
      error: true,
      message: 'username already in use',
    });

  //check if email is already in use
  userExist = await User.findOneBy({ email });
  if (userExist)
    return res.status(400).json({
      error: true,
      message: 'email already in use',
    });

  //hash password
  const hashPass = await hashPassword(password);

  await User.create({
    username,
    email,
    password: hashPass,
  }).save();

  res.status(201).json({
    success: true,
    message: 'signup successful',
  });
};

/**
 * @route POST /api/v1/auth/login
 * @desc - signin user with username and password
 * @acces Public
 */
export const loginUser: RequestHandler = async (req, res) => {
  const { username, password } = req.body as User;

  //check if user exist
  const user = await User.findOneBy({ username });

  if (!user)
    return res.status(422).json({
      error: true,
      message: 'username or password is incorrect',
    });

  //check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({
      error: true,
      message: 'username or password is incorrect',
    });

  const token = getToken(user);

  res.json({
    success: true,
    message: 'login successful',
    data: token,
  });
};

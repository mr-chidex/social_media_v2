import { RequestHandler } from 'express';
// import { Follower } from '../entities/Followers';
// import { Following } from '../entities/Followings';

import { User } from '../entities/User';
import { IRequest, UserDoc, UserDocument } from '../libs/types';
import cloudinary from '../utils/cloudinary';
import { ValidateUserUpdate } from '../utils/user.validators';

/**
 *
 * @route GET /api/v1/users
 * @desc - get all users
 * @acces Private
 */
export const getUsers: RequestHandler = async (_, res) => {
  const users = await User.find({
    order: {
      id: 'ASC',
    },
  });

  res.json({ success: true, message: 'success', data: users });
};

/**
 *
 * @route PATCH /api/v1/users
 * @desc - update a user
 * @acces Private
 */
export const updateUser: RequestHandler = async (req: IRequest, res) => {
  const userId = req.user?.id;

  const { error, value } = ValidateUserUpdate(req.body as UserDoc);

  if (error)
    return res.status(422).json({
      error: true,
      message: error.details[0].message,
    });

  const { username, email } = value as UserDoc;

  const user = (await User.findOneBy({
    id: userId,
  })) as UserDocument;

  if (user.username !== username) {
    const isExist = await User.findOneBy({ username });

    if (isExist)
      return res.status(400).json({
        error: true,
        message: 'username already in use',
      });
  }

  if (user.email !== email) {
    const isExist = await User.findOneBy({ email });
    if (isExist)
      return res.status(400).json({
        error: true,
        message: 'email already in use',
      });
  }

  user.username = username;
  user.email = email;

  const { profilePic, coverPic } = req.files as any;

  if (profilePic) {
    //delete old image
    user.profilePic?.id && (await cloudinary.v2.uploader.destroy(user.profilePic.id));

    //upload new
    const profileImage = await cloudinary.v2.uploader.upload(profilePic[0].path);

    user.profilePic = {
      url: profileImage.secure_url,
      id: profileImage.public_id,
    };
  }

  if (coverPic) {
    //delete old image
    user.coverPic?.id && (await cloudinary.v2.uploader.destroy(user.coverPic.id));

    //upload new
    const coverImage = await cloudinary.v2.uploader.upload(coverPic[0].path);

    user.coverPic = {
      url: coverImage.secure_url,
      id: coverImage.public_id,
    };
  }

  await user.save();

  res.json({ success: true, message: 'updated successfully', data: user });
};

/**
 *
 * @route GET /api/v1/users/profile
 * @desc - see user profile
 * @acces Private
 */
export const getProfile: RequestHandler = async (req: IRequest, res) => {
  const userId = req.user?.id;

  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) return res.status(400).json({ error: true, message: ' user does not exist' });

  res.json({ success: true, message: 'success', data: user });
};

/**
 *
 * @route DELETE /api/v1/users
 * @desc - delete user account
 * @acces Private
 */
export const deleteUser: RequestHandler = async (req: IRequest, res) => {
  const userId = req.user?.id;

  const user = await User.findOneBy({ id: userId });

  if (!user) return res.status(400).json({ error: true, message: ' user does not exist' });

  //destroy images if exist
  user.profilePic?.id && (await cloudinary.v2.uploader.destroy(user.profilePic.id));
  user.coverPic?.id && (await cloudinary.v2.uploader.destroy(user.coverPic.id));

  await user.remove();

  res.status(200).json({ success: true, message: 'user deleted', data: user });
};

/**
 *
 * @route PATCH /api/v1/users/follow?userId=id
 * @desc - follow a user
 * @acces Private
 */
export const followAUser: RequestHandler = async (req: IRequest, res) => {
  const userId = req.query?.userId as string; //user to follow id
  const curUserId = req.user?.id; //current user id
  if (!userId)
    return res.status(400).json({
      error: true,
      message: 'invalid id provided',
    });

  if (userId === curUserId)
    return res.status(403).json({
      error: true,
      message: 'cannot follow yourself',
    });

  const user = await User.findOne({
    where: { id: userId },
  });
  if (!user) return res.status(400).json({ error: true, message: 'user about to follow does not exist' });

  const currentUser = await User.findOne({
    where: { id: curUserId },
  });

  if (!currentUser)
    return res.status(400).json({
      error: true,
      message: 'user not found',
    });

  res.json({ message: 'user followed', user, currentUser });
};

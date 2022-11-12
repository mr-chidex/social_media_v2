import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';

import { User } from '../entities/User';
import { IRequest } from '../libs/types';
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
  const user = req.user as User;

  const { error, value } = ValidateUserUpdate(req.body as User);

  if (error)
    return res.status(422).json({
      error: true,
      message: error.details[0].message,
    });

  const { username, email, biography } = value as User;

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
  user.biography = biography || user.biography;

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
    relations: ['followers', 'followings'],
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
  const user = req.user as User;

  const { password } = req.body as { password: string };

  if (!password)
    return res.status(400).json({
      error: true,
      message: 'password must be provided',
    });

  //check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({
      error: true,
      message: 'password is incorrect',
    });

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
  //user to follow id
  const followId = req.query?.userId as string;

  //current user id
  const currUserId = req.user?.id;
  const loggedInUser = req.user as User;

  if (!followId)
    return res.status(400).json({
      error: true,
      message: 'invalid id provided',
    });

  if (followId === currUserId)
    return res.status(403).json({
      error: true,
      message: 'cannot follow yourself',
    });

  //get user to follow  with relations
  const followUserWithRel = await User.findOne({
    where: { id: followId },
    relations: ['followers'],
  });

  if (!followUserWithRel) return res.status(400).json({ error: true, message: 'user about to follow does not exist' });

  //get logged in user with relations
  const loggedInUserWithRel = await User.findOne({
    where: { id: currUserId },
    relations: ['followings'],
  });

  if (!loggedInUserWithRel)
    return res.status(400).json({
      error: true,
      message: 'user not found',
    });

  // Get the details of the user to be followed.
  const followUser = await User.findOneBy({ id: followId });

  //check if user is already follwed by logged in user
  const isFollowed = followUserWithRel.followers.find((user) => user.id === currUserId);

  if (isFollowed)
    return res.status(403).json({
      error: true,
      message: 'user already followed by you.',
    });

  loggedInUserWithRel.followings = [followUser!, ...loggedInUserWithRel.followings];
  followUserWithRel.followers = [loggedInUser!, ...followUserWithRel.followers];

  await loggedInUserWithRel.save();
  await followUserWithRel.save();

  res.json({
    success: true,
    message: 'user successfully followed',
    data: loggedInUserWithRel,
  });
};

/**
 *
 * @route PATCH /api/v1/users/unfollow?userId=id
 * @desc - unfollow a user
 * @acces Private
 */
export const unfollowAUser: RequestHandler = async (req: IRequest, res) => {
  //user to unfollow id
  const followId = req.query?.userId as string;

  //current user id
  const currUserId = req.user?.id;

  if (!followId)
    return res.status(400).json({
      error: true,
      message: 'invalid id provided',
    });

  if (followId === currUserId)
    return res.status(403).json({
      error: true,
      message: 'cannot unfollow yourself',
    });

  //get user to unfollow  with relations
  const followUserWithRel = await User.findOne({
    where: { id: followId },
    relations: ['followers'],
  });

  if (!followUserWithRel)
    return res.status(400).json({ error: true, message: 'user about to unfollow does not exist' });

  //get logged in user with relations
  const loggedInUserWithRel = await User.findOne({
    where: { id: currUserId },
    relations: ['followings'],
  });

  if (!loggedInUserWithRel)
    return res.status(400).json({
      error: true,
      message: 'user not found',
    });

  // check if loggedin user is following user about to unfollow
  const isFollowing = followUserWithRel.followers.find((user) => user.id === currUserId);

  if (!isFollowing) return res.status(400).json({ error: true, message: "can't unfollow a user you're not following" });

  //update followers and followings
  loggedInUserWithRel.followings = loggedInUserWithRel.followings.filter((user) => user.id !== followId);
  followUserWithRel.followers = followUserWithRel.followers.filter((user) => user.id !== currUserId);

  await loggedInUserWithRel.save();
  await followUserWithRel.save();

  res.json({
    success: true,
    message: 'user successfully unfollowed',
    data: loggedInUserWithRel,
  });
};

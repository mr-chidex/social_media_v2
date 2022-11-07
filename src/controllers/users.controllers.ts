import { RequestHandler } from 'express';

import { User } from '../entities/User';
import { IRequest, UserDoc, UserDocument } from '../libs/types';
import cloudinary from '../utils/cloudinary';

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

  res.json({ status: true, message: 'success', data: users });
};

/**
 *
 * @route PATCH /api/v1/users
 * @desc - update a user
 * @acces Private
 */
export const updateUser: RequestHandler = async (req: IRequest, res) => {
  const userId = req.user?.id;

  const { username, email } = req.body as UserDoc;

  const user = (await User.findOneBy({
    id: userId,
  })) as UserDocument;
  console.log(username);
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

  // await user.save();

  res.json(user);
};

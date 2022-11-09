import { RequestHandler } from 'express';
import { Post } from '../entities/Post';
import { User } from '../entities/User';

import { Image, IRequest, PostDoc } from '../libs/types';
// import { Post, User, ValidatePost } from "../models";
import cloudinary from '../utils/cloudinary';
import { ValidatePost } from '../utils/post.validator';
const folder = 'image/socialMedia';

/**
 *
 * @route POST /api/v1/posts
 * @desc - create post
 * @acces Private
 */
export const createPost: RequestHandler = async (req: IRequest, res) => {
  const user = req.user as User;

  const { error, value } = ValidatePost(req.body as PostDoc);

  if (error)
    return res.status(422).json({
      error: true,
      message: error.details[0].message,
    });

  const { content } = value as PostDoc;

  const image: Image = { url: '', id: '' };
  if (req.file) {
    try {
      const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
        folder,
      });

      image.url = uploadedImage.secure_url;
      image.id = uploadedImage.public_id?.split('/')[2];
    } catch (err) {
      throw new Error('error uploading file');
    }
  }

  await Post.create({
    content,
    image,
    user,
  }).save();

  res.status(201).json({ success: true, message: 'post successfully created' });
};

/**
 *
 * @route GET /api/v1/posts
 * @desc - get all post
 * @acces Private
 */
export const getPosts: RequestHandler = async (_, res) => {
  const posts = await Post.find({
    order: {
      id: 'ASC',
    },
    relations: ['user'],
    select: {
      user: {
        username: true,
        id: true,
        createdAt: true,
        profilePic: {
          url: true,
        },
      },
    },
  });

  res.json({ success: true, message: 'success', data: posts });
};

/**
 *
 * @route GET /api/v1/posts/:postId
 * @desc - get post
 * @acces Private
 */
export const getPost: RequestHandler = async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findOne({
    where: { id: postId },
    relations: ['user'],
    select: {
      user: {
        username: true,
        id: true,
        createdAt: true,
        profilePic: {
          url: true,
        },
      },
    },
  });

  if (!post) return res.status(400).json({ message: ' post does not exist' });

  res.json({ success: true, message: 'success', data: post });
};

/**
 *
 * @route PUT /api/v1/posts/:postId
 * @desc - update post
 * @acces Private
 */
export const updatePost: RequestHandler = async (req: IRequest, res) => {
  const user = req.user;
  const { postId } = req.params;

  const { error, value } = ValidatePost(req.body as PostDoc);

  if (error)
    return res.status(422).json({
      error: true,
      message: error.details[0].message,
    });

  const { content } = value as PostDoc;

  const post = await Post.findOne({
    relations: ['user'],
    where: {
      id: postId,
      user: {
        id: user?.id,
      },
    },
  });

  if (!post) return res.status(400).json({ message: 'post does not exist' });

  post.content = content;

  if (req.file) {
    try {
      //delete old image

      post?.image?.id && (await cloudinary.v2.uploader.destroy(post?.image?.id));

      //upload new image
      const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
        folder,
      });

      post.image = {
        url: uploadedImage.secure_url,
        id: uploadedImage.public_id?.split('/')[2],
      };

      await post.save();
    } catch (err) {
      throw new Error('error uploading file');
    }
  }

  res.json({ message: 'post updated' });
};

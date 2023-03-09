import { RequestHandler } from 'express';

import { Post, PostType } from '../entities/Post';
import { User } from '../entities/User';
import { Image, IRequest, PostDoc } from '../libs/types';
import cloudinary from '../utils/cloudinary';
import { ValidateComment, ValidatePost } from '../utils/post.validator';
const folder = 'image/socialMedia';

/**
 *
 * @route POST /api/v1/comments
 * @desc - create new comment
 * @acces Private
 */
export const createComment: RequestHandler = async (req: IRequest, res) => {
  const user = req.user as User;

  const { error, value } = ValidateComment(req.body as PostDoc);

  if (error)
    return res.status(422).json({
      error: true,
      message: error.details[0].message,
    });

  const { content, postId } = value as PostDoc;

  const post = await Post.findOneBy({ id: postId });
  if (!post)
    return res.status(404).json({
      error: true,
      message: 'post not found',
    });

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
    type: PostType.COMMENT,
    image,
    user,
    post,
  }).save();

  res.status(201).json({ success: true, message: 'comment successfully created' });
};

/**
 *
 * @route GET /api/v1/comments/:postId
 * @desc - get all comments for a post
 * @acces Private
 */
export const getComments: RequestHandler = async (req, res) => {
  const postId = req.query.postId as string;

  const comments = await Post.find({
    order: {
      createdAt: 'DESC',
    },
    relations: ['user', 'likes', 'likes.user', 'comments', 'comments.user', 'comments.likes', 'comments.likes.user'],
    where: {
      type: PostType.COMMENT,
      post: {
        id: postId,
      },
    },
  });

  res.json({ success: true, message: 'success', data: comments });
};

/**
 *
 * @route PATCH /api/v1/comments/:postId
 * @desc - update comment
 * @acces Private
 */
export const updateComment: RequestHandler = async (req: IRequest, res) => {
  const user = req.user;
  const { postId } = req.params;

  const { error, value } = ValidatePost(req.body as PostDoc);

  if (error)
    return res.status(422).json({
      error: true,
      message: error.details[0].message,
    });

  const { content } = value as PostDoc;

  const comment = await Post.findOne({
    where: {
      id: postId,
      user: {
        id: user?.id,
      },
    },
  });

  if (!comment) return res.status(404).json({ message: 'post does not exist' });

  comment.content = content;

  if (req.file) {
    try {
      //delete old image

      comment?.image?.id && (await cloudinary.v2.uploader.destroy(comment?.image?.id));

      //upload new image
      const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
        folder,
      });

      comment.image = {
        url: uploadedImage.secure_url,
        id: uploadedImage.public_id?.split('/')[2],
      };

     
    } catch (err) {
      throw new Error('error uploading file');
    }
    
  }
  await comment.save();
  
  res.json({ success: true, message: 'comment updated' });
};

/**
 *
 * @route DELETE /api/v1/comments/:postId
 * @desc - delete comment
 * @acces Private
 * @Note Deleting a post is same as deleting a comment. This action can be omitted if you want (can use delete post endpoint)
 */
export const deleteComment: RequestHandler = async (req: IRequest, res) => {
  const { postId } = req.params;
  const userId = req.user?.id;
  const isAdmin = req.user?.isAdmin;

  let comment: Post | null;

  if (isAdmin) {
    //admin deleting post
    comment = await Post.findOne({ where: { id: postId } });
  } else {
    // user deleting post
    comment = await Post.findOne({
      relations: ['user'],
      where: {
        id: postId,
        type: PostType.COMMENT,
        user: {
          id: userId,
        },
      },
    });
  }

  if (!comment) return res.status(404).json({ error: true, message: 'comment does not exist' });

  //delete image
  comment.image?.id && (await cloudinary.v2.uploader.destroy(comment.image?.id));

  await comment.remove();

  res.json({ success: true, message: 'comment successfully deleted' });
};

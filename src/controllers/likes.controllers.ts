import { RequestHandler } from 'express';
import { Like } from '../entities/Like';
import { Post } from '../entities/Post';
import { User } from '../entities/User';

import { IRequest } from '../libs/types';

/**
 *
 * @route POST /api/v1/like-post
 * @desc - like a post
 * @acces Private
 */
export const likeOrUnlikePost: RequestHandler = async (req: IRequest, res) => {
  const { postId } = req.body as { postId: string };
  const user = req.user as User;

  if (!postId)
    return res.status(400).json({
      error: true,
      message: 'invalid post id specified',
    });

  //validate post
  const post = await Post.findOneBy({ id: postId });
  if (!post)
    return res.status(404).json({
      error: true,
      message: 'post not found',
    });

  // check if post has been liked by user
  const alreadLiked = await Like.findOne({ where: { user: { id: user.id }, post: { id: postId } } });

  // if already liked, unlike post
  if (alreadLiked) {
    await alreadLiked.remove();

    return res.json({ success: true, messsage: 'successfully unliked post' });
  }

  // like post
  await Like.create({
    post,
    user,
  }).save();

  res.json({ success: true, messsage: 'post successfully liked' });
};

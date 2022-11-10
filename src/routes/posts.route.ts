import expressPromise from 'express-promise-router';

import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getPostsByUser,
  getTimelinePosts,
  updatePost,
} from '../controllers';
import { uploads } from '../middlewares';
import { authUser } from '../middlewares/auth.middleware';

const router = expressPromise();

router.route('/').post(authUser, uploads.single('image'), createPost).get(authUser, getPosts);

router.route('/timeline').get(authUser, getTimelinePosts);
router.route('/user').get(authUser, getPostsByUser);

router
  .route('/:postId')
  .get(authUser, getPost)
  .patch(authUser, uploads.single('image'), updatePost)
  .delete(authUser, deletePost);

export const postsRoutes = router;

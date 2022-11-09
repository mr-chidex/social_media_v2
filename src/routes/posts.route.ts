import expressPromise from 'express-promise-router';

import { createPost, getPost, getPosts, updatePost } from '../controllers';
import { uploads } from '../middlewares';
import { authUser } from '../middlewares/auth.middleware';

const router = expressPromise();

router.route('/').post(authUser, uploads.single('image'), createPost).get(getPosts);
router.route('/:postId').get(authUser, getPost).patch(authUser, uploads.single('image'), updatePost);

export const postsRoutes = router;

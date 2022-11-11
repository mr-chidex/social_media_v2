import expressPromise from 'express-promise-router';

import { createComment, deleteComment, getComments, updateComment } from '../controllers';

import { uploads } from '../middlewares';
import { authUser } from '../middlewares/auth.middleware';

const router = expressPromise();

router.route('/').post(authUser, uploads.single('image'), createComment).get(getComments);
router.route('/:postId').patch(authUser, uploads.single('image'), updateComment).delete(authUser, deleteComment);

export const commentRoutes = router;

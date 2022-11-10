import expressPromise from 'express-promise-router';
import { updatePost } from '../controllers';
import { createComment, deleteComment, getComments } from '../controllers/comments.controllers';

import { uploads } from '../middlewares';
import { authUser } from '../middlewares/auth.middleware';

const router = expressPromise();

router.route('/').post(authUser, uploads.single('image'), createComment).get(getComments);
router.route('/:postId').patch(authUser, uploads.single('image'), updatePost).delete(authUser, deleteComment);

export const commentRoutes = router;

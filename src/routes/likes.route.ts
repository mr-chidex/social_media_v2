import expressPromise from 'express-promise-router';
import { likeOrUnlikePost } from '../controllers/likes.controllers';

import { authUser } from '../middlewares/auth.middleware';

const router = expressPromise();

router.route('/').post(authUser, likeOrUnlikePost);

export const likeRoutes = router;

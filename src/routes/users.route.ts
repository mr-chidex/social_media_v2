import expressPromise from 'express-promise-router';
const router = expressPromise();

import { deleteUser, followAUser, getProfile, getUsers, unfollowAUser, updateUser } from '../controllers';
import { uploads } from '../middlewares';
import { authAdmin, authUser } from '../middlewares/auth.middleware';

router
  .route('/')
  .get(authAdmin, getUsers)
  .patch(
    authUser,
    uploads.fields([
      { name: 'profilePic', maxCount: 1 },
      { name: 'coverPic', maxCount: 1 },
    ]),
    updateUser,
  )
  .delete(authUser, deleteUser);

router.route('/profile').get(authUser, getProfile);
router.route('/follow').patch(authUser, followAUser);
router.route('/unfollow').patch(authUser, unfollowAUser);

export const usersRoutes = router;

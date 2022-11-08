import expressPromise from 'express-promise-router';
const router = expressPromise();

import { deleteUser, getProfile, getUsers, updateUser } from '../controllers';
import { uploads } from '../middlewares';
import { authUser } from '../middlewares/auth.middleware';

router
  .route('/')
  .get(getUsers)
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

export const usersRoutes = router;

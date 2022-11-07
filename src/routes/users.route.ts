import expressPromise from 'express-promise-router';

import { getUsers, updateUser } from '../controllers';

const router = expressPromise();

router.route('/').get(getUsers).patch(updateUser);

export const usersRoutes = router;

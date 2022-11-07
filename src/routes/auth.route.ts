import expressPromise from 'express-promise-router';
import { registerUser, loginUser } from '../controllers';

const router = expressPromise();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

export const authRoutes = router;

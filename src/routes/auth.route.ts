import expressPromise from 'express-promise-router';
import { registerUser } from '../controllers/auth.controllers';

const router = expressPromise();

router.route('/register').post(registerUser);

export const authRoutes = router;

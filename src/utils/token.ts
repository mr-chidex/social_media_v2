import JWT from 'jsonwebtoken';
import config from '../config';
import { UserDoc } from '../libs/types';

export default (user: UserDoc) => {
  return JWT.sign(
    {
      iat: Date.now(),
      iss: 'Mr-Chidex',
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
      coverPic: user.coverPic,
      follow: user.following,
      followers: user.followers,
    },
    config.SECRET_KEY as string,
    { expiresIn: '48h' },
  );
};

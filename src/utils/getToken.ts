import JWT from 'jsonwebtoken';
import config from '../config';
import { UserDoc } from '../libs/types';

export default (user: UserDoc) => {
  return JWT.sign(
    {
      iat: Date.now(),
      iss: 'Mr-Chidex',
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
      coverPic: user.coverPic,
      follow: user.following,
      followers: user.followers,
      biography: user.biography,
      likes: user.likes,
    },
    config.SECRET_KEY as string,
    { expiresIn: '48h' },
  );
};

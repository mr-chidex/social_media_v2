import { Request } from 'express';

export interface UserDoc {
  id: string;
  username: string;
  email: string;
  password: string;
  profilePic?: { url: string; id: string };
  coverPic?: { url: string; id: string };
  isAdmin?: boolean;
  biography?: string;
}

export interface PostDoc {
  content: string;
  postId?: string;
  commentId?: string;
}

export interface Image {
  url: string;
  id: string;
}

export interface IRequest extends Request {
  user?: { id: string; isAdmin: boolean };
}

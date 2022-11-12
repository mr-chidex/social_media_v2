import { Request } from 'express';

export interface PostDoc {
  content: string;
  postId?: string;
}

export interface Image {
  url: string;
  id: string;
}

export interface IRequest extends Request {
  user?: { id: string; isAdmin: boolean };
}

export type Post = {
  id: string;
  postImageUrl: string;
  likes: any[] | null;
  createdAt: string;
  comments: Comment[];
  author: Author;
};

export type Author = {
  image: string;
  username: string;
};

export type Comment = {
  author: Author;
  comment: string;
  _key: string;
  _type: string;
};

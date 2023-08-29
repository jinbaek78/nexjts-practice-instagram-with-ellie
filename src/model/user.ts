export type User = {
  name: string;
  username: string;
  email: string;
  image?: string;
};

export type UserInDB = {
  _type: string;
  name: string;
  _id: string;
  username: string;
  email: string;
  image: string;
  following?: followingUser[];
  _createdAt: string;
  _rev: string;
  _updatedAt: string;
};

export type followingUser = {
  _ref: string;
  _type: string;
  _key: string;
};

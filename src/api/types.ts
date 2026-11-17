export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: { city: string };
  company: { name: string };
};

export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export type NewPost = Omit<Post, "id">;

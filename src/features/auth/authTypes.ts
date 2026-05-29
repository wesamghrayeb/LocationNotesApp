export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};

export type AuthState = {
  users: User[];
  currentUserId: string | null;
};

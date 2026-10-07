export interface User {
  id: number,
  first_name: string,
  middle_name: string | null,
  last_name: string,
  email: string,
  username: string,
  password: string,
  created_at: Date | null,
  modified_at: Date | null
};

export type CreateUserInput = Omit<User, 'id' | 'created_at' | 'modified_at'>;
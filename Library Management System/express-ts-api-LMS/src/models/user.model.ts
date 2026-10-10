export interface User {
  id: number,
  first_name: string,
  middle_name: string | null,
  last_name: string,
  email: string,
  auth_provider: 'local' | 'google',
  provider_user_id: string | null,
  password: string | null, // can be null for google logged in user
  role: 'admin' | 'user',
  created_at: Date | null,
  modified_at: Date | null
};

export type CreateUserInput = Omit<User, 'id' | 'created_at' | 'modified_at'>;
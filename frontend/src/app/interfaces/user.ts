export interface User {
  id_user?: number;
  email: string;
  role?: 'admin' | 'user' | 'guest';
  name?: string;
  surname?: string;
  password?: string;
}


export interface AuthResponse {
  accessToken: string;
  user: User
}

export interface Login {
  email: string;
  password: string;
}


export interface User {
  id: string;
  username: string;
  displayName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: {                    
    user: User;
    token: string;
  };
  error: string | null;      
}
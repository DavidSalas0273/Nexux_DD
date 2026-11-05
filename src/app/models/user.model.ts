export interface User {
  id: number;
  nombre: string;
  correo: string;
  foto: string | null;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  password: string;
  foto?: File;
}

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  provider: 'email' | 'google';
  createdAt: Date;
}

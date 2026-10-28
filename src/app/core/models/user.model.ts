import { CookingLevel } from './cooking-level.model';

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  provider: 'email' | 'google';
  createdAt: Date;
  cookingLevel?: CookingLevel;  // se asigna en el onboarding post-registro
}

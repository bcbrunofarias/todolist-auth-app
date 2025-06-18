export interface DecodedToken {
  name: string;
  email: string;
  jti: string;
  roles: string[];
  permissions: string[];
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
}
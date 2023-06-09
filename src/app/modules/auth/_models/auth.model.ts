export class AuthModel {
  access: string;
  refresh: string;
  expiresIn: Date;

  setAuth(auth: any) {
    this.access = auth.access;
    this.refresh = auth.refresh;
    this.expiresIn = auth.expiresIn;
  }
}

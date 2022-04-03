export class FormInput {
  constructor(
    public email: string,
    public password: string,
    public returnSecureToken?: boolean
  ) {
    (this.email = email),
      (this.password = password),
      (this.returnSecureToken = returnSecureToken);
  }
}

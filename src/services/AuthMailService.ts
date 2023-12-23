import Auth from "../models/Auth";
import Mail from "./MailService";

export default class AuthMailService {
  private mailService: Mail;
  constructor() {
    this.mailService = Mail.getMailInstance();
  }

  public async sendConfirmation(user: any) {
    const email = {
      to: user.email,
      subject: `Bienvenido(a) ${user.email}`,
      template: "confirmation",
      context: user,
    };
    return await this.mailService.send(email);
  }
}

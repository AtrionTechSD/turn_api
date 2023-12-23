import nodemailer from "nodemailer";
import config from "../../app.config";
import hbs from "nodemailer-express-handlebars";
import path from "path";

interface IEmail {
  context?: any;
  template?: string;
  to: string;
  from?: string;
  subject: string;
  attachment?: Array<any>;
}

export default class MailService {
  private transporter: nodemailer.Transporter;
  private static instance: MailService;
  private email!: IEmail;

  private constructor() {
    this.transporter = nodemailer.createTransport(config.mail);
    this.initTemplate();
  }

  public static getMailInstance() {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }

  private initTemplate() {
    this.transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".hbs",
          partialsDir: path.join(__dirname, "../../views", "templates"),
          layoutsDir: path.join(
            __dirname,
            "../../views",
            "templates",
            "layouts"
          ),
          defaultLayout: "",
        },
        viewPath: path.join(__dirname, "../../views", "templates"),
        extName: ".hbs",
      })
    );
  }

  public setEmail(emailOptions: IEmail): nodemailer.Transporter {
    emailOptions.from = config.mail.from;
    this.email = emailOptions;
    return this.transporter;
  }

  async send(emailOptions: IEmail): Promise<any> {
    return new Promise((resolve, reject) => {
      this.setEmail(emailOptions).sendMail(this.email, (err, info) => {
        if (err) {
          reject(err);
        }
        resolve(info);
      });
    });
  }
}

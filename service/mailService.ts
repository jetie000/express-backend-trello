import { Transporter, createTransport } from "nodemailer"
import { config } from "../config/config"
import { IMailService } from "./interfaces/mailService.interface"

class MailService implements IMailService{
  transporter: Transporter

  constructor() {
    this.transporter = createTransport({
      host: config.SMTP_HOST,
      port: Number(config.SMTP_PORT),
      secure: false,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD
      }
    })
  }
  async sendActivationMail(email: string, activationLink: string) {
    await this.transporter.sendMail({
      from: config.SMTP_USER,
      to: email,
      text: "",
      subject: "Активация аккаунта на TrelloClone",
      html: `
                <div>
                    <h1>Для активации аккаунта перейдите по ссылке</h1>
                    <a href="${activationLink}">${activationLink}</a>
                </div>
            `
    })
  }
}

export default MailService

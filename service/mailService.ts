import { Transporter, createTransport } from "nodemailer"
import { configMy } from "../config/config"
import { IMailService } from "./interfaces/mailService.interface"

class MailService implements IMailService {
  transporter: Transporter

  constructor() {
    this.transporter = createTransport({
      host: configMy.SMTP_HOST,
      port: Number(configMy.SMTP_PORT),
      secure: false,
      auth: {
        user: configMy.SMTP_USER,
        pass: configMy.SMTP_PASSWORD
      }
    })
  }
  async sendActivationMail(email: string, activationLink: string) {
    await this.transporter.sendMail({
      from: configMy.SMTP_USER,
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

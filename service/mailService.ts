import { Transporter, createTransport } from "nodemailer"

class MailService {
  transporter: Transporter

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }
  async sendActivationMail(email: string, activationLink: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
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

export default new MailService()

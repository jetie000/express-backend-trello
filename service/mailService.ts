import { Transporter, createTransport } from "nodemailer"

class MailService {
    transporter: Transporter

    constructor(){
        this.transporter = createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }
    async sendActivationMail(email: string, activationLink: string) {

    }
}

export default new MailService()
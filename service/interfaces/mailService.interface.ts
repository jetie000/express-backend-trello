export interface IMailService {
  sendActivationMail(email: string, activationLink: string): Promise<void>
}

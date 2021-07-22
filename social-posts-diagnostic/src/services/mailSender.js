class MailSenderService {
  async sendEmail(to, subject, body) {
    console.log('SendEmail called', { to, subject, body })
  }

  async sendEmails(recipients, subject, body) {
    recipients.map(to => this.sendEmail(to, subject, body))
  }
}

module.exports = MailSenderService

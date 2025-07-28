const nodemailer = require("nodemailer");
const html = require("../templates/html");
const config = require("../utils/config");

module.exports = class Email {
  constructor(user, data) {
    this.to = user.email;
    this.name = user.firstName || user.lastName || user.name;
    this.data = data;
    this.from = `Stanley Kelechi <${config.emailFrom}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.googleUsername,
          pass: config.googlePassword,
        },
      });
    }

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.googleUsername,
        pass: config.googlePassword,
      },
    });
  }

  async send(template, subject) {
    const html = template;

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    const info = await this.newTransport().sendMail(mailOptions);
  }

  async sendOTPEmail() {
    console.log("Sending OTP email to", this.to, this.name, this.data);
    await this.send(
      html.passwordOTP(this.name, this.data),
      "Password Reset OTP"
    );
    return;
  }

  async sendAccountEmail() {
    await this.send(
      html.accountCreationEmail(this.name, this.data),
      "Your account has been created"
    );
    return;
  }

  async giftVoucherEmail() {
    await this.send(
      html.giftVoucherEmail(this.name, this.data),
      "You have been gifted a voucher"
    );
    return;
  }
};

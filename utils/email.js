const nodemailer = require('nodemailer');
const pug = require('pug');
// const htmlToText = require('html-to-text');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Olubunmi Ogunjemiyo <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Brevo
      // return nodemailer.createTransport({
      //   service: 'Brevo',
      //   auth: {
      //     user: process.env.BREVO_USERNAME,
      //     pass: process.env.BREVO_PASSWORD,
      //   },
      // });

      return nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: 587, // Use the appropriate port provided by Brevo
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.BREVO_USERNAME,
          pass: process.env.BREVO_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      socketTimeout: 60000, // Increase timeout to 60 seconds (adjust as needed)
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    //1) Render HTML based on pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    //2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // text: htmlToText.fromString(html),
      text: convert(html),
    };

    // 3) create transport and send emails

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours family');
  }

  async sendPasswordReset() {
    await this.send(
      'PasswordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};

/*
const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    // Activate in gmail "less secure app" option
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  // 2) define the email options
  const mailOptions = {
    from: 'Olubunmi Ogunjemiyo <bjemiyor@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
  
};
*/

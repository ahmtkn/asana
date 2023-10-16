const eventEmitter = require('./eventEmitter');
const nodemailer = require("nodemailer");

module.exports = () => {
    eventEmitter.on('send_email', async (data) => {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            ...data
        });
        console.log("Message sent: %s", info.messageId);

    });
}
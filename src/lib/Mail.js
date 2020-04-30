import nodemailer from 'nodemailer';

import { resolve } from 'path'; //percorre url até o diretório
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

class Mail {
constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
        host, 
        port, 
        secure,
        auth: auth.user ? auth: null, //Para envio de email sem autenticação, se não tiver usuário passe usuário nulo
    });
    this.configureTemplates();
}
configureTemplates() { //configuração das templates de email
const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails'); //caminho onde estará as views do emails
this.transporter.use('compile', nodemailerhbs({
viewEngine: exphbs.create({
    layoutsDir: resolve(viewPath, 'layouts'),
    partialsDir: resolve(viewPath, 'partials'),
    defaultLayout: 'default',
    extname: '.hbs'
    }), 
    viewPath,
    extName: '.hbs',
}));
}

sendMail(message) { //envio de email
    return this.transporter.sendMail({
        ...mailConfig.default, //pega tudo que está dentro do mail.js como default
        ...message,
    });
}
}
export default new Mail();
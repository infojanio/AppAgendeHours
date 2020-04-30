export default {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },

    default: {
        from: 'Sup. Apoio Adm. Comercial <gr13a@saneago.com.br', 
    },
};

/*
Serviços de email, são pagos
Amazon SES 
Mailgun
Sparkpost
Mandril(Mailchimp)
Gmail, não use este, pois vc poderá ser bloqueado

Vamos usar o Mailtrap, que funciona apenas em ambiente de desenvolvimento
*/
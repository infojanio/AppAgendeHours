export default {
    dsn: process.env.SENTRY_DSN, 

 //Em ambiente de produção passamos dentro do .env 
 // dentro do .env: SENTRY_DSN: https:b4960acbc69f4ca4ad386a20da3ec5cd@o385598.ingest.sentry.io/5218650
    
 //porém para ambiente de desenvolvimento não convém, pois envia os erros para o sentry.io
 //então, dentro do .env , deixaremos apenas SENTRY_DSN:
    // Daí não mandará mensagens para www.sentry.io
};
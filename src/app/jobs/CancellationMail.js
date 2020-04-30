import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
    get key() {
        return 'CancellationMail';
}
async handle( {data} ) { //Chamado para o envio de cada email
    const { appointment } = data; 
    //abaixo vamos criar o método para enviar email de cancelamento para o usuário

//testando se a fila está funcionando
console.log('A fila executou...');

      await Mail.sendMail({
        to: `${appointment.provider.name} <${appointment.provider.email}>`,
        subject: 'Cancelamento de Agendamento',
        template: 'cancellation', //nome da template da pasta emails
        context: {
            provider: appointment.provider.name,
            user: appointment.user.name,
            date: format(parseISO(appointment.date, "'dia' dd 'de' MMMM', às' H:mm'h' ",
            { locale: pt } //faz a tradução da data para português
        )),
        },
    });
}
}
export default new CancellationMail();
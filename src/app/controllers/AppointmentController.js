import * as Yup from 'yup'; //faz a autenticação
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns'; //biblioteca para trabalhar com datas

import pt from 'date-fns/locale/pt'; //faz a tradução da data para português
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController { //classe responsável por controlar o agendamento de serviços   
//método para listar agendamentos
async index(req, res) {

const { page=1 } =req.query; //paginação 

const appointments = await Appointment.findAll({
where: { user_id: req.userId, canceled_at: null },  //lista agendamentos que não foram cancelados  
order: ['date'],
attributes: ['id', 'date', 'past', 'cancelable'],
limit: 20,//listar 20 registros 
offset: (page - 1) * 20, //Quantos registros quero pular

include: [
    { 
        model: User,  //relacionamento entre User e provider
        as: 'provider',
        attributes: ['id', 'name'],
        include: [
            {
            model: File,
            as: 'avatar', 
            attributes: ['id', 'path', 'url'],   
            },
        ],
    },
],
}); 

return res.json(appointments); 
}

//registra um agendamento
async store(req, res) {
    const schema = Yup.object().shape({
        provider_id: Yup.number().required(),
        date: Yup.date().required(),
    });
    
    if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação!' });               
    }
    const { provider_id, date } = req.body;

    //checar se o provider_id é um provider , provider=prestador
    const isProvider = await User.findOne({
        where: { id: provider_id, provider: true },
    });

    if(!isProvider){
        return res
        .status(401)
        .json( {error: 'Você só pode agendar compromissos com prestadores!'});
    }

/*Tarefa: fazer uma vericação para que o usuário não marque um agendamento com ele mesmo  
//checar, o (req.userId) não pode ser igual provider_id

const isProvider = await User.findOne({
    where: { id: provider_id, provider: true },
});

if(!isProvider){
    return res
    .status(401)
    .json( {error: 'Você só pode agendar compromissos com prestadores!'});
}
Tarefa: fazer uma vericação para que o usuário não marque um agendamento com ele mesmo  
*/



    //verificar se a data e hora do agendamento já passou
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
        return res.status(400).json( { error: 'Data passada não é permitida!' });
    }

    //Verificar se o prestador de serviço já tem horário
    const checkAvailability = await Appointment.findOne( {
        where: {
            provider_id,
            canceled_at: null,
            date: hourStart,
        },
    }); 
    
    if(checkAvailability) {
        return res.status(400).json( { error: 'Prestador não possui horário disponível nesta data!'});
    }

    //cria o agendamento
    const appointment = await Appointment.create({
        user_id: req.userId,
        provider_id,
        date,
    }); 
    
    //cria a notificação de marcação de agendamento com o prestador
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
        hourStart,
        "'dia' dd 'de' MMMM', às' H:mm'h' ",
        { locale: pt } //faz a tradução da data para português
    );

    await Notification.create({
        content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
        user: provider_id,
        
    });

    return res.json(appointment); 
}

async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
        include: [
          
            {
            model: User,
            as: 'provider',
            attributes: ['name', 'email'],
        },
            {
        model: User,
        as: 'user',
        attributes: ['name'],
        }  

        ],
        });

    if (appointment.user_id != req.userId) { //se o dono do agendamento for diferente do usuário logado
        return res.status(401).json({
            error: "Você não têm permissão para cancelar esse agendamento!", 
        });
    }
        //subHours traz data com horário a menos
        const dateWithSub = subHours(appointment.date, 2); //2 horas a menos do horário do agendamento
        
        //verifica se a data do agendamento - 2 horas é menor que tempo limite,
        //ex: 13:00 é a data do agendamento
        //dateWithSub: 11h
        //hora atual: 11:25      Então o agendamento não poderá ser cancelado

        if(isBefore(dateWithSub, new Date())) { //compara o horário dateWithSub com o horário atual
            return res.status(401).json({
                error: "Só é possível cancelar agendamentos com mais de 2 horas de antecedência!"
            });
        }
            appointment.canceled_at = new Date(); //seta a data do cancelamento dentro do canceled_at
            await appointment.save();
            
            await Queue.add(CancellationMail.key, {
               appointment,            
            
            });

        return res.json(appointment);
    }
}
export default new AppointmentController(); 
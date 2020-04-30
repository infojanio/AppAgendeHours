import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleController {
async index( req, res ) {
    const checkUserProvider = await User.findOne({
     where: { id: req.userId, provider: true },   
    });
    if (!checkUserProvider) { //se o usuário logado não estiver provider:true
        return res.status(400).json({error: 'Usuário não é um prestador!'} )
    }

    //pega os agendamentos do dia, de 00:00:00 até 23:59:59
    const { date } = req.query;
    const parseDate = parseISO(date);

    
    const appointments = await Appointment.findAll({ //verificar todos os agendamentos 
        where: {
            provider_id: req.userId, //do usuário logado
            canceled_at: null, //que não foram cancelados
            date: {  //e que a data estiver entre início e fim do dia recebido como parâmetro
                [Op.between]: [ startOfDay(parseDate), endOfDay(parseDate)], //between é um valor de comparação entre 2 valores
            },
        },
        order: ['date'], //ordenar por data
    });


    return res.json(appointments);
}
}
export default new ScheduleController();
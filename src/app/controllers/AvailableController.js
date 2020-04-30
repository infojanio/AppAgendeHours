import { startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
    async index(req, res) {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json( {error: 'Data inválida!'} );
        }

        const searchDate = Number(date); //Number, pq o date formatado em n. inteiro

        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.params.providerId,
                canceled_at: null,
                date: {
                    [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],

                },
            },
        });

        //Horários de atendimento do prestador de serviços
        const schedule = [
            '08:00', //2020-04-27 08:00:00
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '23:00',                        
        ];
        //objeto que retorna as datas disponívels para o cliente
        const available = schedule.map(time => {
            const [hour, minute] = time.split(':');
            const value = setSeconds(setMinutes(setHours(searchDate, hour), minute),0); //2020-04-27 08:00:00

            return {
                time,
                value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
                available: 
                isAfter(value, new Date())  //isAfter pega o horário atual, dando false para anterioes e true para os que estão após o horário atual 
                && !appointments.find(a => format(a.date, 'HH:mm') == time),  //pega os agendamentos e verifica se horário está disponivel
            };
        });

        return res.json(available);
    }
}
export default new AvailableController();
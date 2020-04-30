import Sequelize, {Model, VIRTUAL} from 'sequelize';
import { isBefore, subHours } from 'date-fns'; 

class Appointment extends Model {
    static init (sequelize) { //sequelize é a variavel responsável pela connection
        super.init({
            date: Sequelize.DATE,
            canceled_at: Sequelize.DATE,
      
       //mostrar para o frontend agendamentos que já passaram
            past: {
            type: Sequelize.VIRTUAL,
            get() {
            return isBefore(this.date, new Date()); //retorna true(horário não passou) e false(horário já passou)
               },
            },
                        
        //------------------------------ 
               //Verificar se faltam 2 horas para o horario, se ainda é possivel cancelar
             cancelable: {
             type: Sequelize.VIRTUAL,
             get() {
             return isBefore(new Date(), subHours(this.date, 2)); //retorna true(horário não passou) e false(horário já passou)
                },
             },
          },                 
         //------------------------------ 
          {
            sequelize, //connection
         }
        );
        
        return this;
    }

    static associate(models) {
        //QUANDO EXISTE DOIS RELACIONAMENTO NO MODELS, É OBRIGATÓRIO O APELIDO , as:
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user'}); 
        this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider'});
    }     
        }

export default Appointment;
import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
    
    async index (req, res) {
            //checar se o provider_id é um provider , provider=prestador
        const checkIsProvider = await User.findOne({
        where: { id: req.userId, provider: true },
    });
    
    if (!checkIsProvider) {
        return res
        .status(401)
        .json( {error: 'Somente o cliente poderá carregar as notificações!'});
    } 

  
            //listar as notificações
        const notifications = await Notification.find({   //find no mongoDB = findAll no sequelize
            user: req.userId, 
        }).sort( {createdAt: 'desc'} ).limit(20); //sort vai ordenar as notificações, desc - ordem decrescente, o -1 também funcionaria  

        return res.json(notifications);
    } 

    async update (req, res) {
       //pegar parâmetros que vem da rota /notification:id
        const notification = await Notification.findByIdAndUpdate( //encontra pelo id e já atualiza os campos abaixo
            req.params.id,
            { read: true }, //atualiza esse campo no banco de dados
            { new: true }  //mostra o campo já atualizado
        );
            return res.json(notification);
    }
}
export default new NotificationController();    
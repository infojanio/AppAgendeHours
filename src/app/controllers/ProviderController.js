import User from '../models/User';
import File from '../models/File';

class ProviderController {
async index(req, res) {
    const providers = await User.findAll({ 
        where: { provider: true}, //retorna todos os usuários que o provider=true
        attributes: ['id', 'name', 'email', 'avatar_id'], //mostra apenas esses atributos
        include: [ { 
            model: File, 
            as: 'avatar', 
            attributes: ['name', 'path', 'url'],
        }, ], //todos os dados de File ficará dentro deste include, que será renomeado para avatar 
        
    });
    return res.json(providers);
}
}
export default new ProviderController();
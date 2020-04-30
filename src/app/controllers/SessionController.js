import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
    async store (req, res) {
//Validação dos dados na sessão de usuário, evita logar com campos vazios.
const schema = Yup.object().shape( {
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
});  
//Verifica se as regras passadas acima são true ou false
if (! (await schema.isValid(req.body))) {
return res.status(400).json( {error: 'Dados de entrada não foram validados!'});
}

        //verificação de email cadastrado
        const { email, password } = req.body;
        const user = await User.findOne( {where: { email } });

        if (!user) {
            return res.status(401).json( {error: "Usuário não encontrado!"});   
        }

        if (! (await user.checkPassword(password))) {
            return res.status(401).json( { error: 'Senha não confere!'});
        }

        const  { id, name } = user;

        return res.json ({
            user: {
                id,
                name,
                email, 
            },
            token: jwt.sign( { id }, authConfig.secret, {  //código hash gerado no site: https://www.md5online.org/
            expiresIn: authConfig.expiresIn,    //expira em 7 dias
            }),
        
    });
}
}
export default new SessionController();
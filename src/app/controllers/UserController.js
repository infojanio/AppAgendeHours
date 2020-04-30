import * as Yup from 'yup'; //assim importamos tudo para a variável Yup, A biblioteca yup não possui EXPORT
import User from '../models/User';

class UserController {
async store (req, res) {

//Validação dos dados de entrada no backend
const schema = Yup.object().shape( {
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6),
});  
//Verifica se as regras passadas acima são true ou false
if (! (await schema.isValid(req.body))) {
    return res.status(400).json( {error: 'Dados de entrada não foram validados!'});
}


//Verifica se já existe o e-mail cadastrado
const userExists = await User.findOne( {where: { email: req.body.email } });

if (userExists) {
    return res.status(400).json( {error: 'Este email já foi cadastrado!'} )
}

    const {id, name, email, provider } = await User.create(req.body);
    return res.json( {
        id,
        name,
        email,
        provider,
    });    
}

    async update(req, res) {
        
        //Validação dos dados de entrada no backend
        const schema = Yup.object().shape( {
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(6),
        
        //se a senha velha foi informada, então é obrigatório a senha nova
        password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field)=>  
        oldPassword ? field.required() : field ),
        
        //Faz a verificação da confirmação da nova senha, para que seja obrigatório confirmar
        confirmPassword: Yup.string().when('password', (password, field) => 
        password ? field.required().oneOf([Yup.ref('password')]): field),
        });  
        
        //Verifica se as regras passadas acima são true ou false
        if (! (await schema.isValid(req.body))) {
        return res.status(400).json( {error: 'Dados de entrada não foram validados!'});
        }

        //recupera email e senha antiga
        const { email, oldPassword } = req.body; 
        const user  = await User.findByPk(req.userId);

        if (email != user.email) {
            const userExists = await User.findOne( { where: {email} });

            if (userExists) {
                return res.status(400).json( { error: 'Usuário não exite!'});
            }
        }
        //só verifico a mudança de senha se o usuário informar a senha antiga
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json( { error: 'A Senha não foi encontrada!' });           
        }
        //Aqui vamos enviar no res.json as informações
        const {id, name, provider } = await user.update(req.body);
        return res.json( { 
            id,
            name,
            email,
            provider,
        });    
        
    }
}

export default new UserController();
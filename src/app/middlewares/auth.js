import jwt from 'jsonwebtoken';
import { promisify } from 'util'; //nativo da biblioteca do node

import authConfig from '../../config/auth'; //no auth, está o segredo do token, que vamos desicriptografar

export default async (req, res, next) => { 
    const authHeader = req.headers.authorization; //authorization é o nome do Headers criado
    
    if (! authHeader){  //authHeader, ou seja se não houver itoken no cabeçalho
        return res.status(401).json( {error: 'Token não fornecido!'});
    }
    
  //const [Bearer, token] assim desestruturo a primeira posição do array  
    const [, token] = authHeader.split(' '); //o split separa os arrays, descarta o 1º, a palavra Bearer

    try {  
        const decoded = await promisify(jwt.verify) (token, authConfig.secret); //decifra o itoken do secret
//o id do usuário ficará dentro do decoded  
        
        console.log(decoded);    
        req.userId = decoded.id;  //pega o id do usuário

        return next();
        }    
        catch (err) {
        return res.status(401).json( {error: "Token Inválido!"});    
        }
    
};
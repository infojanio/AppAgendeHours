import Sequelize, {Model} from 'sequelize';
import bcrypt from 'bcryptjs'; 

class User extends Model {
    static init (sequelize) { //sequelize é a variavel responsável pela connection
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.VIRTUAL,  //VIRTUAL nunca irá existir na base de dados, apenas no código
            password_hash: Sequelize.STRING,
            provider: Sequelize.BOOLEAN,  //provider(fornecedor->true ou false), usuário pode logar como cliente ou fornecedor 
        },

        {
            sequelize, //connection
        }
        );
        //Função do sequelize, que executa automaticamente o código antes que qualquer usuário sejá salvo no banco de dados
        this.addHook('beforeSave', async (user)=> {
            if (user.password) { //se for digitado a senha, ela será guardada e criptografada
                user.password_hash = await bcrypt.hash(user.password, 8); 
            }
        });
        return this;
    }
//faz o relacionamento entre id do arquivo dentro da tabela usuário 
static associate (models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' }); 
}      //belongsTo -> id do arquivo dentro da tabela de usuários 
        //hasOne -> id do usuário dentro da tabela de arquivo 
        //hasMany -> id do usuário dentro de vários registros da tabela de arquivo 

    //função para checar a senha, compara a senha informada com a criptografada
    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
        }
        
}
export default User;
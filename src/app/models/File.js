import Sequelize, {Model} from 'sequelize';

class File extends Model {
    static init (sequelize) { //sequelize é a variavel responsável pela connection
        super.init({
            name: Sequelize.STRING,
            path: Sequelize.STRING,
            url: {
                type: Sequelize.VIRTUAL,
                get() {
                    return `${process.env.APP_URL}/files/${ this.path }`;
                },
            },
        },

        {
            sequelize, //connection
         }
        );
        
        return this;
    }
        }

export default File;
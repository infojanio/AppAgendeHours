module.exports = {
  up: (queryInterface, Sequelize) => {    
      return queryInterface.createTable('files', { 
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },

        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        path: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        },

        created_at: { //data de criação do banco preenchido automaticamente pelo sequelize
          type: Sequelize.DATE,
          allowNull: false,
        },

        updated_at: { //data de atualização do banco preenchido automaticamente pelo sequelize
          type: Sequelize.DATE,
          allowNull: false,
        }

      });
    
  },

  down: (queryInterface) => {  
      return queryInterface.dropTable('files');
   
  },
};

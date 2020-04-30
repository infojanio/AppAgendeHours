'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {    
      return queryInterface.createTable('users', { 
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

        email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        },

        password_hash: {  //_hash significa que a senha será criptografada
        type: Sequelize.STRING,
        allowNull: false,  
        },

        provider: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,

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
      return queryInterface.dropTable('users');
   
  },
};

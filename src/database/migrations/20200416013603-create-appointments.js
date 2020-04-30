module.exports = {
  up: (queryInterface, Sequelize) => {    
      return queryInterface.createTable('appointments', { 
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },

        date: {
          type: Sequelize.DATE,
          allowNull: false,
        },

        user_id: {
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL', //mesmo se o usuário foi deletado, os agendamentos continuam no banco
          allowNull: true,
        },

        canceled_at: {
          type: Sequelize.DATE,
        },

        provider_id: {
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL', //mesmo se o prestador foi deletado, os agendamentos continuam no banco
          allowNull: true,
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
      return queryInterface.dropTable('appointments');
   
  },
};
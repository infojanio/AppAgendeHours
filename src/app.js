// criação das midllewares
import 'dotenv/config'; //configura as variáveis de ambiente

import express from 'express';
import path from 'path';
import Youch from 'youch'; 
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';
import 'express-async-errors'; //deve ser importado antes das routes

import routes from './routes';
import './database';

//teste do git estou na linha de versão novo_gobarber

/*
O novo javascript usa a sintaxe acima para importar bibliotecas, mas temos que instalar: yarn add sucrase - D
const express = require('express');
const routes = require('./routes');
*/

class App {
  constructor() {
    this.server = express();

    //tratamento de excessões, erros
    Sentry.init(sentryConfig);
   
    this.midllewares();
    this.routes();
    this.exceptionHandler(); //inicializa o tratamento de erros mostrados para o usuário
  } 

  midllewares() {
     //tratamento de excessões, deve vir antes das rotas
    this.server.use(express.json());
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))); //link da galeria imagem
  }

  routes() {
    this.server.use(routes); // irão funcionar como
    this.server.use(Sentry.Handlers.errorHandler()); // deve vir depois das rotas, tratamento de excessões
  }

  exceptionHandler() { //middle para tratamento de erros
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV == 'development') { //se tiver em ambiente de desenvolvimento
        const errors = await new Youch(err, req).toJSON(); //também poderia apresentar a msg em toHTML
        return res.status(500).json(errors);
      }
      
      return res.status(500).json({error: 'Erro interno de servidor!'}); //apresenta o erro de servidor
    });
  }
}

export default new App().server; // export default necessita do dependencia yarn sucrase -D

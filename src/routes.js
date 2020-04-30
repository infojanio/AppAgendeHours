import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddlewares from './app/middlewares/auth';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddlewares); //middleware global que verifica se o usuário está logado, APENAS AS ROTAS ABAIXO DELA
routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index); //rota de listagem de prestadores de serviços
routes.get('/providers/:providerId/available', AvailableController.index); //rota que lista horários disponíveis apenas para 1 provider 

routes.get('/appointments', AppointmentController.index); //rota de listagem de agendamentos
routes.post('/appointments', AppointmentController.store); 
routes.delete('/appointments/:id', AppointmentController.delete); //deleta o agendamento

routes.get('/schedules', ScheduleController.index); //rota de agendamentos do prestador de serviços
routes.get('/notifications', NotificationController.index); //lista as notificações do usuário
routes.put('/notifications/:id', NotificationController.update); //atualizar status das notificações Lidas


routes.post('/files', upload.single('file'), FileController.store);


export default routes;



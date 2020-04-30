import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

class Queue {

constructor(){
this.queues = {}; //todos os jobs da nossa aplicação ficarão armazenados dentro do this.queues
this.init();
}

init(){
    jobs.forEach(({ key, handle }) => {
        this.queues[key] = {
            bee: new Bee(key, {
              redis: redisConfig,    //conexão com o banco redis   
        }), 
        handle,  //recebe a tarefa e executa em background
    };
    });
}

// Adiciona novos trabalhos dentro de cada fila
add(queue, job) {
return this.queues[queue].bee.createJob(job).save();
}
//processar as filas
processQueue() { //pega os jobs e fica processando em tempo real
    jobs.forEach(job=> {
        const { bee, handle } = this.queues[job.key];

        bee.on('failed', this.handleFailure).process(handle); //pega o bee(fila) e passa o handle(processa) por parametro
    });
}
    //Monitora as falhas nas filas e mostra o erro no console
    handleFailure(job, err) {
        console.log(`Queue ${job.queue.name}: FAILED`, err);
    }
}   
export default new Queue();
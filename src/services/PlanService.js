import {Plan} from '../domain/Plan.js';
export class PlanService {
 constructor(repo){this.repo=repo;}
 crear(d){return this.repo.crear(new Plan(d));}
 listar(opciones){return this.repo.listar(opciones);}
 async actualizar(id,d){const plan=new Plan(d);const actualizadas=await this.repo.actualizar(Number(id),plan);if(!actualizadas)throw new Error('Plan no encontrado o sin cambios.');return actualizadas;}
 async desactivar(id){const afectadas=await this.repo.desactivar(Number(id));if(!afectadas)throw new Error('Plan no encontrado o ya inactivo.');return afectadas;}
}

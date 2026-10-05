import { Alimento, PlanNutricional } from '../models/PlanNutricional.js';

export class NutricionService {
 constructor(repo){this.repo=repo;}
 crearPlan(datos,usuario){return this.repo.crearPlan(new PlanNutricional({...datos,creado_por:usuario.id}));}
 listarPlanes(clienteId){return this.repo.listarPlanes(Number(clienteId));}
 agregarAlimento(datos){return this.repo.agregarAlimento(new Alimento(datos));}
 listarAlimentos(planId){return this.repo.listarAlimentos(Number(planId));}
 reporteSemanal(planId){return this.repo.reporteSemanal(Number(planId));}
}
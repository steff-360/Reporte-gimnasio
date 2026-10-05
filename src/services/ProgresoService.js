import { Progreso } from '../models/Progreso.js';

export class ProgresoService {
 constructor(repo){this.repo=repo;}
 crear(datos,usuario){return this.repo.crear(new Progreso({...datos,creado_por:usuario.id}));}
 listarPorCliente(clienteId){return this.repo.listarPorCliente(Number(clienteId));}
 eliminar(id){return this.repo.eliminar(Number(id));}
}
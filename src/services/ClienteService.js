import {Cliente} from '../domain/Cliente.js';
export class ClienteService {
 constructor(repo){this.repo=repo;}
 crear(d){return this.repo.crear(new Cliente(d));}
 listar(opciones){return this.repo.listar(opciones);}
 buscar(id){return this.repo.buscar(Number(id));}
 async actualizar(id,d){if(!await this.buscar(id))throw new Error('Cliente no encontrado.');return this.repo.actualizar(Number(id),new Cliente(d));}
 async desactivar(id){if(!await this.buscar(id))throw new Error('Cliente no encontrado.');return this.repo.desactivar(Number(id));}
}

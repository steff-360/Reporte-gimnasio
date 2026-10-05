import { requireDate, requirePositiveId } from '../models/validation.js';

export class ContratoService {
 constructor(repo,clientes,planes){this.repo=repo;this.clientes=clientes;this.planes=planes;}
 requireAdmin(usuario){if(usuario?.rol!=='ADMIN')throw new Error('Acceso denegado: se requiere rol ADMIN.');}
 async crear({cliente_id,plan_id,fecha_inicio}){const clienteId=requirePositiveId(cliente_id,'El cliente'),planId=requirePositiveId(plan_id,'El plan');const fechaInicio=requireDate(fecha_inicio,'La fecha de inicio');const cliente=await this.clientes.buscar(clienteId);if(!cliente||!cliente.activo)throw new Error('Cliente inexistente o inactivo.');const p=(await this.planes.listar()).find(x=>x.id===planId&&x.activo);if(!p)throw new Error('Plan inexistente o inactivo.');const fechaFinDate=new Date(`${fechaInicio}T00:00:00Z`);fechaFinDate.setUTCDate(fechaFinDate.getUTCDate()+p.duracion_dias-1);const fecha_fin=fechaFinDate.toISOString().slice(0,10);return this.repo.crear({cliente_id:clienteId,plan_id:planId,fecha_inicio:fechaInicio,fecha_fin,precio_acordado:p.precio,duracion_dias:p.duracion_dias});}
 listar(){return this.repo.listar();}
 cancelar(id,usuario){this.requireAdmin(usuario);return this.repo.cancelar(requirePositiveId(id,'El contrato'));}
 finalizar(id,usuario){this.requireAdmin(usuario);return this.repo.finalizar(requirePositiveId(id,'El contrato'));}
 renovar(id,fechaInicio,usuario){this.requireAdmin(usuario);return this.repo.renovar(requirePositiveId(id,'El contrato'),fechaInicio?requireDate(fechaInicio,'La fecha de inicio'):undefined);}
}

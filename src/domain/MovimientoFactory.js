import { requireDate, requirePositiveId } from '../models/validation.js';

export class MovimientoFactory {
 static crear({tipo,concepto,monto,fecha,cliente_id=null,contrato_id=null,creado_por}) {
  if(!['INGRESO','EGRESO'].includes(tipo)) throw new Error('Tipo inválido.');
  if(!concepto?.trim()) throw new Error('Concepto obligatorio.');
  if(!Number.isFinite(Number(monto))||Number(monto)<=0) throw new Error('Monto debe ser mayor que cero.');
    const fechaValidada=requireDate(fecha,'La fecha');
    const usuarioId=requirePositiveId(creado_por,'El usuario');
    return {tipo,concepto:concepto.trim(),monto:Number(monto),fecha:fechaValidada,cliente_id:cliente_id===null?null:requirePositiveId(cliente_id,'El cliente'),contrato_id:contrato_id===null?null:requirePositiveId(contrato_id,'El contrato'),creado_por:usuarioId};
 }
}

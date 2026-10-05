import { optionalNumber, requireDate, requirePositiveId } from './validation.js';

export class Progreso {
 constructor({contrato_id, cliente_id, fecha, peso_kg, grasa_corporal, cintura_cm, brazo_cm, pierna_cm, foto_url = null, comentarios = null, creado_por}) {
  this.contrato_id = requirePositiveId(contrato_id, 'El contrato');
  this.cliente_id = requirePositiveId(cliente_id, 'El cliente');
  this.fecha = requireDate(fecha, 'La fecha');
  this.peso_kg = optionalNumber(peso_kg, 'El peso', {min: Number.MIN_VALUE, max: 999.99});
  if (this.peso_kg === null) throw new Error('El peso es obligatorio.');
  this.grasa_corporal = optionalNumber(grasa_corporal, 'La grasa corporal', {max: 100});
  this.cintura_cm = optionalNumber(cintura_cm, 'La cintura', {max: 999.99});
  this.brazo_cm = optionalNumber(brazo_cm, 'El brazo', {max: 999.99});
  this.pierna_cm = optionalNumber(pierna_cm, 'La pierna', {max: 999.99});
  if (foto_url !== null && (typeof foto_url !== 'string' || foto_url.length > 500)) throw new Error('La referencia de foto no es válida.');
  if (comentarios !== null && (typeof comentarios !== 'string' || comentarios.length > 500)) throw new Error('Los comentarios no pueden superar 500 caracteres.');
  this.foto_url = foto_url?.trim() || null;
  this.comentarios = comentarios?.trim() || null;
  this.creado_por = requirePositiveId(creado_por, 'El usuario');
 }
}
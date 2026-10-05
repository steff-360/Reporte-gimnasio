export function requirePositiveId(value, field) {
 const id = Number(value);
 if (!Number.isInteger(id) || id <= 0) throw new Error(`${field} debe ser un entero positivo.`);
 return id;
}

export function requireDate(value, field) {
 if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
  throw new Error(`${field} debe tener formato AAAA-MM-DD.`);
 }
 const date = new Date(`${value}T00:00:00Z`);
 if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
  throw new Error(`${field} no es una fecha válida.`);
 }
 return value;
}

export function requireDateRange({desde = null, hasta = null} = {}) {
 const inicio = desde ? requireDate(desde, 'La fecha inicial') : null;
 const fin = hasta ? requireDate(hasta, 'La fecha final') : null;
 if (inicio && fin && inicio > fin) throw new Error('La fecha inicial no puede ser posterior a la fecha final.');
 return {desde: inicio, hasta: fin};
}

export function optionalNumber(value, field, {min = 0, max = Number.POSITIVE_INFINITY} = {}) {
 if (value === undefined || value === null || value === '') return null;
 const number = Number(value);
 if (!Number.isFinite(number) || number < min || number > max) {
  throw new Error(`${field} debe estar entre ${min} y ${max}.`);
 }
 return number;
}
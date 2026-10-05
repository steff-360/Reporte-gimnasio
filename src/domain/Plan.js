export class Plan {
 constructor({nombre,descripcion=null,duracion_dias,nivel,meta,precio}) {
  if(!nombre?.trim()||!meta?.trim()) throw new Error('Nombre y meta son obligatorios.');
  if(!Number.isInteger(Number(duracion_dias))||Number(duracion_dias)<=0) throw new Error('Duración inválida.');
  if(!['PRINCIPIANTE','INTERMEDIO','AVANZADO'].includes(nivel)) throw new Error('Nivel inválido.');
  if(!Number.isFinite(Number(precio))||Number(precio)<0) throw new Error('Precio inválido.');
  Object.assign(this,{nombre:nombre.trim(),descripcion,duracion_dias:Number(duracion_dias),nivel,meta:meta.trim(),precio:Number(precio)});
 }
}

export class Plan {
    constructor({ nombre, descripcion = null, duracion_dias, nivel, meta, precio }) {
      // Validar nombre y meta
      if (!nombre?.trim() || !meta?.trim()) {
        throw new Error('Nombre y meta son obligatorios.');
      }
  
      // Validar duración
      if (!Number.isInteger(Number(duracion_dias)) || Number(duracion_dias) <= 0) {
        throw new Error('Duración inválida.');
      }
  
      // Validar nivel
      if (!['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'].includes(nivel)) {
        throw new Error('Nivel inválido.');
      }
  
      // Validar precio
      if (!Number.isFinite(Number(precio)) || Number(precio) < 0) {
        throw new Error('Precio inválido.');
      }
  
      // Asignar propiedades
      Object.assign(this, {
        nombre: nombre.trim(),
        descripcion,
        duracion_dias: Number(duracion_dias),
        nivel,
        meta: meta.trim(),
        precio: Number(precio)
      });
    }
  }
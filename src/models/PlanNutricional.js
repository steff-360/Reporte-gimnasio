import { optionalNumber, requireDate, requirePositiveId } from './validation.js';

const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
const comidas = ['DESAYUNO', 'ALMUERZO', 'CENA', 'MERIENDA'];

export class PlanNutricional {
  constructor({ cliente_id, plan_id, nombre, objetivo = null, fecha_inicio, fecha_fin = null, creado_por }) {
    // Validar cliente y plan
    this.cliente_id = requirePositiveId(cliente_id, 'El cliente');
    this.plan_id = requirePositiveId(plan_id, 'El plan de entrenamiento');

    // Validar nombre
    if (typeof nombre !== 'string' || !nombre.trim() || nombre.length > 120) {
      throw new Error('El nombre es obligatorio y no puede superar 120 caracteres.');
    }

    // Validar objetivo
    if (objetivo !== null && (typeof objetivo !== 'string' || objetivo.length > 180)) {
      throw new Error('El objetivo no puede superar 180 caracteres.');
    }

    // Validar fechas
    this.nombre = nombre.trim();
    this.objetivo = objetivo?.trim() || null;
    this.fecha_inicio = requireDate(fecha_inicio, 'La fecha de inicio');
    this.fecha_fin = fecha_fin ? requireDate(fecha_fin, 'La fecha de fin') : null;

    if (this.fecha_fin && this.fecha_fin < this.fecha_inicio) {
      throw new Error('La fecha de fin no puede ser anterior al inicio.');
    }

    // Validar usuario creador
    this.creado_por = requirePositiveId(creado_por, 'El usuario');
  }
}

export class Alimento {
  constructor({ plan_nutricional_id, dia_semana, tiempo_comida, nombre, porcion = null, calorias = null }) {
    // Validar plan nutricional
    this.plan_nutricional_id = requirePositiveId(plan_nutricional_id, 'El plan nutricional');

    // Validar día de la semana
    if (!dias.includes(dia_semana)) {
      throw new Error('Día de semana inválido.');
    }

    // Validar tiempo de comida
    if (!comidas.includes(tiempo_comida)) {
      throw new Error('Tiempo de comida inválido.');
    }

    // Validar nombre del alimento
    if (typeof nombre !== 'string' || !nombre.trim() || nombre.length > 150) {
      throw new Error('El nombre del alimento es obligatorio y no puede superar 150 caracteres.');
    }

    // Validar porción
    if (porcion !== null && (typeof porcion !== 'string' || porcion.length > 100)) {
      throw new Error('La porción no puede superar 100 caracteres.');
    }

    // Asignar propiedades
    this.dia_semana = dia_semana;
    this.tiempo_comida = tiempo_comida;
    this.nombre = nombre.trim();
    this.porcion = porcion?.trim() || null;
    this.calorias = optionalNumber(calorias, 'Las calorías');
  }
}
import test from 'node:test';
import assert from 'node:assert/strict';
import { Progreso } from '../../src/models/Progreso.js';
import { Alimento, PlanNutricional } from '../../src/models/PlanNutricional.js';

const progresoValido={contrato_id:1,cliente_id:2,fecha:'2026-09-20',peso_kg:72.5,creado_por:3};

test('crea progreso físico validado',()=>{
 const progreso=new Progreso(progresoValido);
 assert.equal(progreso.peso_kg,72.5);
 assert.equal(progreso.grasa_corporal,null);
});

test('rechaza fecha imposible en progreso',()=>{
 assert.throws(()=>new Progreso({...progresoValido,fecha:'2026-02-30'}),/fecha válida/);
});

test('rechaza porcentaje de grasa fuera de rango',()=>{
 assert.throws(()=>new Progreso({...progresoValido,grasa_corporal:101}),/grasa corporal/);
});

test('crea plan de alimentación asociado a entrenamiento',()=>{
 const plan=new PlanNutricional({cliente_id:2,plan_id:4,nombre:'Balanceado',fecha_inicio:'2026-09-01',creado_por:3});
 assert.equal(plan.plan_id,4);
});

test('rechaza fin anterior al inicio en plan nutricional',()=>{
 assert.throws(()=>new PlanNutricional({cliente_id:2,plan_id:4,nombre:'Plan',fecha_inicio:'2026-09-10',fecha_fin:'2026-09-09',creado_por:3}),/anterior/);
});

test('valida alimento por día, comida y calorías',()=>{
 const alimento=new Alimento({plan_nutricional_id:1,dia_semana:'LUNES',tiempo_comida:'DESAYUNO',nombre:'Avena',calorias:250});
 assert.equal(alimento.calorias,250);
 assert.throws(()=>new Alimento({plan_nutricional_id:1,dia_semana:'LUNES',tiempo_comida:'DESAYUNO',nombre:'Avena',calorias:-1}),/calorías/);
});
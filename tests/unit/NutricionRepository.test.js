import test from 'node:test';
import assert from 'node:assert/strict';
import { NutricionRepository } from '../../src/repositories/NutricionRepository.js';

function crearRepo({contratoActivo=true}={}) {
 const llamadas=[];
 const conexion={
  beginTransaction:async()=>llamadas.push('begin'),
  execute:async(sql)=>{
   llamadas.push(sql.startsWith('SELECT')?'validar-contrato':'crear-plan');
   if(sql.startsWith('SELECT'))return [contratoActivo?[{id:5}]:[]];
   return [{insertId:12}];
  },
  commit:async()=>llamadas.push('commit'),
  rollback:async()=>llamadas.push('rollback'),
  release:()=>llamadas.push('release')
 };
 return {llamadas,repo:new NutricionRepository({getConnection:async()=>conexion})};
}

const plan={cliente_id:2,plan_id:3,nombre:'Nutrición',objetivo:null,fecha_inicio:'2026-09-01',fecha_fin:null,creado_por:4};

test('crea un plan nutricional bajo contrato activo en una transacción',async()=>{
 const {llamadas,repo}=crearRepo();
 assert.equal(await repo.crearPlan(plan),12);
 assert.deepEqual(llamadas,['begin','validar-contrato','crear-plan','commit','release']);
});

test('revierte creación nutricional si no existe contrato activo',async()=>{
 const {llamadas,repo}=crearRepo({contratoActivo:false});
 await assert.rejects(()=>repo.crearPlan(plan),/contrato activo/);
 assert.deepEqual(llamadas,['begin','validar-contrato','rollback','release']);
});
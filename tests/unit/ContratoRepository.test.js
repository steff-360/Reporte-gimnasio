import test from 'node:test';
import assert from 'node:assert/strict';
import { ContratoRepository } from '../../src/repositories/ContratoRepository.js';

function repositorioMock({fallarActualizacion=false}={}) {
 const llamadas=[];
 const conexion={
  beginTransaction:async()=>llamadas.push('begin'),
  execute:async(sql)=>{
   llamadas.push(sql.startsWith('DELETE')?'delete-progreso':sql.startsWith('UPDATE')?'update-contrato':'lock-contrato');
   if(sql.startsWith('SELECT'))return [[{estado:'ACTIVO'}]];
   if(fallarActualizacion&&sql.startsWith('UPDATE'))throw new Error('Error al cancelar');
   return [{}];
  },
  commit:async()=>llamadas.push('commit'),
  rollback:async()=>llamadas.push('rollback'),
  release:()=>llamadas.push('release')
 };
 return {llamadas,repo:new ContratoRepository({getConnection:async()=>conexion})};
}

test('cancelar contrato elimina progreso y actualiza estado en una transacción',async()=>{
 const {llamadas,repo}=repositorioMock();
 await repo.cancelar(8);
 assert.deepEqual(llamadas,['begin','lock-contrato','delete-progreso','update-contrato','commit','release']);
});

test('cancelar contrato revierte progreso si falla el cambio de estado',async()=>{
 const {llamadas,repo}=repositorioMock({fallarActualizacion:true});
 await assert.rejects(()=>repo.cancelar(8),/Error al cancelar/);
 assert.deepEqual(llamadas,['begin','lock-contrato','delete-progreso','update-contrato','rollback','release']);
});

test('renovar finaliza el contrato actual y crea el siguiente en una transacción',async()=>{
 const llamadas=[];
 let parametrosNuevoContrato;
 const conexion={
  beginTransaction:async()=>llamadas.push('begin'),
  execute:async(sql,parametros)=>{
   if(sql.startsWith('SELECT'))return [[{cliente_id:2,plan_id:3,fecha_fin:'2026-09-30',precio_acordado:'350.00',duracion_dias:30,estado:'ACTIVO'}]];
   if(sql.startsWith('UPDATE')){llamadas.push('finalizar-anterior');return [{}];}
   parametrosNuevoContrato=parametros;
   llamadas.push('crear-renovacion');
   return [{insertId:21}];
  },
  commit:async()=>llamadas.push('commit'),
  rollback:async()=>llamadas.push('rollback'),
  release:()=>llamadas.push('release')
 };
 const repo=new ContratoRepository({getConnection:async()=>conexion});
 assert.equal(await repo.renovar(8),21);
 assert.deepEqual(parametrosNuevoContrato,[2,3,'2026-10-01','2026-10-30','350.00',30]);
 assert.deepEqual(llamadas,['begin','finalizar-anterior','crear-renovacion','commit','release']);
});
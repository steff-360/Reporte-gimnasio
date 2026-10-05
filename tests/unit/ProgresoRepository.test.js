import test from 'node:test';
import assert from 'node:assert/strict';
import { ProgresoRepository } from '../../src/repositories/ProgresoRepository.js';

test('revierte progreso duplicado en la misma semana del contrato',async()=>{
 const llamadas=[];
 const conexion={
  beginTransaction:async()=>llamadas.push('begin'),
  execute:async(sql)=>{
   if(sql.startsWith('SELECT cliente_id'))return [[{cliente_id:2}]];
   if(sql.startsWith('SELECT id'))return [[{id:9}]];
   throw new Error('No debe insertar un segundo progreso semanal.');
  },
  commit:async()=>llamadas.push('commit'),
  rollback:async()=>llamadas.push('rollback'),
  release:()=>llamadas.push('release')
 };
 const repo=new ProgresoRepository({getConnection:async()=>conexion});
 await assert.rejects(()=>repo.crear({contrato_id:3,cliente_id:2,fecha:'2026-09-21'}),/esa semana/);
 assert.deepEqual(llamadas,['begin','rollback','release']);
});
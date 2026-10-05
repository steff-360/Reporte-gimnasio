import test from 'node:test';
import assert from 'node:assert/strict';
import { ContratoService } from '../../src/services/ContratoService.js';

function crearService(){
 const llamadas=[];
 const repo={
  cancelar:async()=>{llamadas.push('cancelar');},
  finalizar:async()=>{llamadas.push('finalizar');},
  renovar:async()=>{llamadas.push('renovar');}
 };
 return {llamadas,service:new ContratoService(repo,{}, {})};
}

test('bloquea mutaciones administrativas de contrato para entrenadores',async()=>{
 const {llamadas,service}=crearService();
 const entrenador={id:8,rol:'ENTRENADOR'};
 assert.throws(()=>service.cancelar(1,entrenador),/Acceso denegado/);
 assert.throws(()=>service.finalizar(1,entrenador),/Acceso denegado/);
 assert.throws(()=>service.renovar(1,undefined,entrenador),/Acceso denegado/);
 assert.deepEqual(llamadas,[]);
});

test('permite mutaciones de contrato a administrador',async()=>{
 const {llamadas,service}=crearService();
 const admin={id:1,rol:'ADMIN'};
 await service.cancelar(1,admin);
 await service.finalizar(2,admin);
 await service.renovar(3,undefined,admin);
 assert.deepEqual(llamadas,['cancelar','finalizar','renovar']);
});
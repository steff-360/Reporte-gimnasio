import test from 'node:test';
import assert from 'node:assert/strict';
import { FinanzasService } from '../../src/services/FinanzasService.js';

function crearService(){
 const llamadas=[];
 const repo={
  registrar:async()=>{llamadas.push('registrar');return 3;},
  listar:async()=>{llamadas.push('listar');return [];},
  balance:async()=>{llamadas.push('balance');return {ingresos:0,egresos:0,balance:0};}
 };
 return {llamadas,service:new FinanzasService(repo)};
}

test('bloquea operaciones financieras para entrenadores',async()=>{
 const {llamadas,service}=crearService();
 const entrenador={id:4,rol:'ENTRENADOR'};
 assert.throws(()=>service.registrar({tipo:'INGRESO',concepto:'Pago',monto:50,fecha:'2026-09-01'},entrenador),/Acceso denegado/);
 assert.throws(()=>service.listar({},entrenador),/Acceso denegado/);
 assert.throws(()=>service.balance({},entrenador),/Acceso denegado/);
 assert.deepEqual(llamadas,[]);
});

test('permite operaciones financieras al administrador',async()=>{
 const {llamadas,service}=crearService();
 const admin={id:1,rol:'ADMIN'};
 assert.equal(await service.registrar({tipo:'INGRESO',concepto:'Pago',monto:50,fecha:'2026-09-01'},admin),3);
 await service.listar({},admin);
 await service.balance({},admin);
 assert.deepEqual(llamadas,['registrar','listar','balance']);
});
test('permite generar reporte mensual al administrador', async () => {
  const { llamadas, service } = crearService();
  service.repo.reporteMensual = async () => {
    llamadas.push('reporteMensual');
    return { totalIngresos: 100, totalEgresos: 40, balanceNeto: 60 };
  };

  const reporte = await service.reporteMensual({ anio: 2025, mes: 7 }, { id: 1, rol: 'ADMIN' });

  assert.deepEqual(reporte, { totalIngresos: 100, totalEgresos: 40, balanceNeto: 60 });
  assert.deepEqual(llamadas, ['reporteMensual']);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { FinanzasRepository } from '../../src/repositories/FinanzasRepository.js';

function crearConexion({fallarInsercion = false} = {}) {
 const llamadas=[];
 const conexion={
  beginTransaction:async()=>llamadas.push('begin'),
  execute:async(sql)=>{
   if(fallarInsercion&&sql.startsWith('INSERT'))throw new Error('Fallo de inserción');
   return [{insertId:17}];
  },
  commit:async()=>llamadas.push('commit'),
  rollback:async()=>llamadas.push('rollback'),
  release:()=>llamadas.push('release')
 };
 return {llamadas,conexion,pool:{getConnection:async()=>conexion}};
}

const movimiento={tipo:'INGRESO',concepto:'Mensualidad',monto:120,fecha:'2026-09-01',creado_por:1};

test('registra un movimiento dentro de una transacción',async()=>{
 const {llamadas,pool}=crearConexion();
 const id=await new FinanzasRepository(pool).registrar(movimiento);
 assert.equal(id,17);
 assert.deepEqual(llamadas,['begin','commit','release']);
});

test('revierte y libera la conexión si falla el registro',async()=>{
 const {llamadas,pool}=crearConexion({fallarInsercion:true});
 await assert.rejects(()=>new FinanzasRepository(pool).registrar(movimiento),/Fallo de inserción/);
 assert.deepEqual(llamadas,['begin','rollback','release']);
});

test('agrega balance en SQL con filtros parametrizados',async()=>{
 let consulta;
 const totales=[{ingresos:'100.00',egresos:'35.50'}];
 const repo=new FinanzasRepository({execute:async(sql,parametros)=>{consulta={sql,parametros};return [totales];}});
 const balance=await repo.balance({desde:'2026-09-01',hasta:'2026-09-30',clienteId:9});
 assert.deepEqual(consulta.parametros,['2026-09-01','2026-09-30',9]);
 assert.match(consulta.sql,/fecha >= \?/);
 assert.match(consulta.sql,/fecha <= \?/);
 assert.match(consulta.sql,/cliente_id = \?/);
 assert.match(consulta.sql,/SUM\(CASE WHEN tipo = 'INGRESO'/);
 assert.deepEqual(balance,{ingresos:100,egresos:35.5,balance:64.5});
});

test('rechaza fechas imposibles y rangos invertidos en consultas financieras',async()=>{
 const repo=new FinanzasRepository({execute:async()=>[[]]});
 await assert.rejects(()=>repo.listar({desde:'2026-02-30'}),/fecha válida/);
 await assert.rejects(()=>repo.balance({desde:'2026-10-01',hasta:'2026-09-01'}),/no puede ser posterior/);
});
test('genera reporte financiero mensual con agregaciones SQL', async () => {
  let consulta;
  const filas = [{
    mensualidades: '3500.00',
    sesiones_individuales: '800.00',
    otros_ingresos: '200.00',
    total_ingresos: '4500.00',
    gastos_operativos: '900.00',
    suplementos: '300.00',
    devoluciones: '100.00',
    total_egresos: '1300.00',
    balance_neto: '3200.00'
  }];

  const repo = new FinanzasRepository({
    execute: async (sql, parametros) => {
      consulta = { sql, parametros };
      return [filas];
    }
  });

  const reporte = await repo.reporteMensual({ anio: 2025, mes: 7, clienteId: 4 });

  assert.deepEqual(consulta.parametros, ['2025-07-01', '2025-07-31', 4]);
  assert.match(consulta.sql, /SUM\(CASE WHEN tipo = 'INGRESO'/);
  assert.match(consulta.sql, /SUM\(CASE WHEN tipo = 'EGRESO'/);
  assert.match(consulta.sql, /SUM\(CASE WHEN tipo = 'INGRESO' THEN monto WHEN tipo = 'EGRESO' THEN -monto/);
  assert.match(consulta.sql, /LOWER\(concepto\)/);
  assert.match(consulta.sql, /fecha BETWEEN \? AND \?/);
  assert.deepEqual(reporte, {
    mensualidades: 3500,
    sesionesIndividuales: 800,
    otrosIngresos: 200,
    totalIngresos: 4500,
    gastosOperativos: 900,
    suplementos: 300,
    devoluciones: 100,
    totalEgresos: 1300,
    balanceNeto: 3200
  });
});

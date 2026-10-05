import test from 'node:test';import assert from 'node:assert/strict';import {MovimientoFactory} from '../../src/domain/MovimientoFactory.js';
test('crea movimiento',()=>assert.equal(MovimientoFactory.crear({tipo:'INGRESO',concepto:'Pago',monto:10,fecha:'2026-09-01',creado_por:1}).tipo,'INGRESO'));
test('rechaza monto cero',()=>assert.throws(()=>MovimientoFactory.crear({tipo:'EGRESO',concepto:'Compra',monto:0,fecha:'2026-09-01',creado_por:1})));
test('rechaza una fecha imposible',()=>assert.throws(()=>MovimientoFactory.crear({tipo:'EGRESO',concepto:'Compra',monto:10,fecha:'2026-02-30',creado_por:1}),/fecha válida/));
test('rechaza identificador de cliente inválido',()=>assert.throws(()=>MovimientoFactory.crear({tipo:'INGRESO',concepto:'Pago',monto:10,fecha:'2026-09-01',cliente_id:-2,creado_por:1}),/cliente debe ser un entero positivo/));

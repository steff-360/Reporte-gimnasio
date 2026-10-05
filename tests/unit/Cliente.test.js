import test from 'node:test';import assert from 'node:assert/strict';import {Cliente} from '../../src/domain/Cliente.js';
test('cliente válido',()=>assert.equal(new Cliente({nombre:'Ana',apellido:'Pérez'}).nombre,'Ana'));
test('rechaza nombre vacío',()=>assert.throws(()=>new Cliente({nombre:'',apellido:'Pérez'})));
test('rechaza correo inválido',()=>assert.throws(()=>new Cliente({nombre:'Ana',apellido:'Pérez',correo:'x'})));
test('rechaza espacios en correo',()=>assert.throws(()=>new Cliente({nombre:'Ana',apellido:'Pérez',correo:'ana perez@example.com'}),/Correo inválido/));

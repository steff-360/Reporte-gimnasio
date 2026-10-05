import test from 'node:test';import assert from 'node:assert/strict';import {Plan} from '../../src/domain/Plan.js';
test('plan válido',()=>assert.equal(new Plan({nombre:'Básico',duracion_dias:30,nivel:'PRINCIPIANTE',meta:'Salud',precio:10}).duracion_dias,30));
test('rechaza precio negativo',()=>assert.throws(()=>new Plan({nombre:'Básico',duracion_dias:30,nivel:'PRINCIPIANTE',meta:'Salud',precio:-1})));

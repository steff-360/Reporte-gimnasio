import test from 'node:test';
import assert from 'node:assert/strict';
import { ContratoService } from '../../src/services/ContratoService.js';

function crearService() {
 const repo={crear:async datos=>datos};
 const clientes={buscar:async id=>({id,activo:true})};
 const planes={listar:async()=>[{id:5,activo:true,duracion_dias:30,precio:350}]};
 return new ContratoService(repo,clientes,planes);
}

test('rechaza una fecha imposible antes de crear el contrato',async()=>{
 await assert.rejects(()=>crearService().crear({cliente_id:2,plan_id:5,fecha_inicio:'2026-02-30'}),/fecha válida/);
});

test('calcula el vencimiento de forma estable en UTC',async()=>{
 const contrato=await crearService().crear({cliente_id:2,plan_id:5,fecha_inicio:'2026-09-01'});
 assert.equal(contrato.fecha_fin,'2026-09-30');
});
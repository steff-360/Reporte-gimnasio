import inquirer from 'inquirer';
import chalk from 'chalk';
import {pool} from './config/database.js';
import {UsuarioRepository} from './repositories/UsuarioRepository.js';
import {ClienteRepository} from './repositories/ClienteRepository.js';
import {PlanRepository} from './repositories/PlanRepository.js';
import {ContratoRepository} from './repositories/ContratoRepository.js';
import {FinanzasRepository} from './repositories/FinanzasRepository.js';
import {ProgresoRepository} from './repositories/ProgresoRepository.js';
import {NutricionRepository} from './repositories/NutricionRepository.js';
import {AuthService} from './services/AuthService.js';
import {ClienteService} from './services/ClienteService.js';
import {PlanService} from './services/PlanService.js';
import {ContratoService} from './services/ContratoService.js';
import {FinanzasService} from './services/FinanzasService.js';
import {ProgresoService} from './services/ProgresoService.js';
import {NutricionService} from './services/NutricionService.js';
import { ejecutarReporteFinanciero } from './commands/reporte-financiero.js';
const ur=new UsuarioRepository(pool), cr=new ClienteRepository(pool), pr=new PlanRepository(pool), cor=new ContratoRepository(pool), fr=new FinanzasRepository(pool);
const progresoRepo=new ProgresoRepository(pool), nutricionRepo=new NutricionRepository(pool);
const auth=new AuthService(ur), clientes=new ClienteService(cr), planes=new PlanService(pr), contratos=new ContratoService(cor,cr,pr), finanzas=new FinanzasService(fr), progreso=new ProgresoService(progresoRepo), nutricion=new NutricionService(nutricionRepo);
const ask=async(q,type='input')=>(await inquirer.prompt([{type,name:'v',message:q}])).v;
const admin=u=>u.rol==='ADMIN';
async function menu(u){
 let done=false;
 while(!done){
    const opts=['Registrar cliente','Listar clientes','Buscar cliente','Actualizar cliente','Desactivar cliente','Crear plan','Listar planes','Actualizar plan','Desactivar plan','Asignar plan / crear contrato','Listar contratos','Renovar contrato','Finalizar contrato','Cancelar contrato','Registrar progreso','Ver progreso','Eliminar progreso','Crear plan nutricional','Listar planes nutricionales','Agregar alimento','Reporte nutricional semanal','Registrar ingreso','Registrar egreso','Ver movimientos','Ver balance','Reporte financiero mensual','Reporte financiero mensual','Cerrar sesión'];
    const adminOnly=['Actualizar cliente','Desactivar cliente','Actualizar plan','Desactivar plan','Renovar contrato','Finalizar contrato','Cancelar contrato','Registrar ingreso','Registrar egreso','Ver movimientos','Ver balance','Reporte financiero mensual'];
    const allowed=opts.filter(x=>admin(u)||!adminOnly.includes(x));
  const selected=(await inquirer.prompt([{type:'list',name:'op',message:`${u.nombre} (${u.rol})`,choices:allowed}])).op;
  try{
   if(selected==='Registrar cliente'){const d=await inquirer.prompt([{name:'nombre',message:'Nombre:'},{name:'apellido',message:'Apellido:'},{name:'correo',message:'Correo (opcional):'},{name:'telefono',message:'Teléfono:'},{name:'edad',message:'Edad (opcional):'}]);console.log(chalk.green('ID: '+await clientes.crear({...d,correo:d.correo||null,edad:d.edad?Number(d.edad):null})));}
   else if(selected==='Listar clientes')console.table(await clientes.listar());
   else if(selected==='Buscar cliente')console.log(await clientes.buscar(Number(await ask('ID cliente:'))));
    else if(selected==='Actualizar cliente'){const id=Number(await ask('ID cliente:'));const d=await inquirer.prompt([{name:'nombre',message:'Nombre:'},{name:'apellido',message:'Apellido:'},{name:'correo',message:'Correo (opcional):'},{name:'telefono',message:'Teléfono:'},{name:'edad',message:'Edad (opcional):'}]);await clientes.actualizar(id,{...d,correo:d.correo||null,edad:d.edad?Number(d.edad):null});console.log(chalk.green('Cliente actualizado.'));}
    else if(selected==='Desactivar cliente'){await clientes.desactivar(Number(await ask('ID cliente:')));console.log(chalk.green('Cliente desactivado.'));}
   else if(selected==='Crear plan'){const d=await inquirer.prompt([{name:'nombre',message:'Nombre:'},{name:'descripcion',message:'Descripción:'},{name:'duracion_dias',message:'Duración en días:',validate:v=>Number(v)>0||'Debe ser mayor que cero'},{type:'list',name:'nivel',message:'Nivel:',choices:['PRINCIPIANTE','INTERMEDIO','AVANZADO']},{name:'meta',message:'Meta:'},{name:'precio',message:'Precio:',validate:v=>Number(v)>=0||'Precio inválido'}]);console.log(chalk.green('ID: '+await planes.crear(d)));}
   else if(selected==='Listar planes')console.table(await planes.listar());
    else if(selected==='Actualizar plan'){const id=Number(await ask('ID plan:'));const d=await inquirer.prompt([{name:'nombre',message:'Nombre:'},{name:'descripcion',message:'Descripción:'},{name:'duracion_dias',message:'Duración en días:',validate:v=>Number(v)>0||'Debe ser mayor que cero'},{type:'list',name:'nivel',message:'Nivel:',choices:['PRINCIPIANTE','INTERMEDIO','AVANZADO']},{name:'meta',message:'Meta:'},{name:'precio',message:'Precio:',validate:v=>Number(v)>=0||'Precio inválido'}]);await planes.actualizar(id,d);console.log(chalk.green('Plan actualizado.'));}
    else if(selected==='Desactivar plan'){await planes.desactivar(Number(await ask('ID plan:')));console.log(chalk.green('Plan desactivado.'));}
    else if(selected==='Asignar plan / crear contrato'){const d=await inquirer.prompt([{name:'cliente_id',message:'ID cliente:',validate:v=>Number(v)>0||'ID inválido'},{name:'plan_id',message:'ID plan:',validate:v=>Number(v)>0||'ID inválido'},{name:'fecha_inicio',message:'Fecha inicio (AAAA-MM-DD):'}]);console.log(chalk.green('Contrato generado. ID: '+await contratos.crear(d)));}
   else if(selected==='Listar contratos')console.table(await contratos.listar());
    else if(selected==='Renovar contrato'){const id=Number(await ask('ID contrato activo:'));const fecha_inicio=await ask('Fecha inicio de renovación (AAAA-MM-DD, Enter para día siguiente al vencimiento):');console.log(chalk.green('Nuevo contrato: '+await contratos.renovar(id,fecha_inicio||undefined,u)));}
    else if(selected==='Finalizar contrato'){await contratos.finalizar(Number(await ask('ID contrato:')),u);console.log(chalk.green('Contrato finalizado.'));}
     else if(selected==='Cancelar contrato'){await contratos.cancelar(await ask('ID contrato:'),u);console.log(chalk.green('Contrato cancelado.'));}
    else if(selected==='Registrar progreso'){const d=await inquirer.prompt([{name:'contrato_id',message:'ID contrato activo:',validate:v=>Number(v)>0||'ID inválido'},{name:'cliente_id',message:'ID cliente:',validate:v=>Number(v)>0||'ID inválido'},{name:'fecha',message:'Fecha (AAAA-MM-DD):'},{name:'peso_kg',message:'Peso kg:',validate:v=>Number(v)>0||'Peso inválido'},{name:'grasa_corporal',message:'Grasa corporal % (opcional):'},{name:'cintura_cm',message:'Cintura cm (opcional):'},{name:'brazo_cm',message:'Brazo cm (opcional):'},{name:'pierna_cm',message:'Pierna cm (opcional):'},{name:'foto_url',message:'Ruta o URL de foto (opcional):'},{name:'comentarios',message:'Comentarios (opcional):'}]);console.log(chalk.green('Progreso registrado. ID: '+await progreso.crear({...d,grasa_corporal:d.grasa_corporal||null,cintura_cm:d.cintura_cm||null,brazo_cm:d.brazo_cm||null,pierna_cm:d.pierna_cm||null,foto_url:d.foto_url||null,comentarios:d.comentarios||null},u)));}
    else if(selected==='Ver progreso')console.table(await progreso.listarPorCliente(Number(await ask('ID cliente:'))));
    else if(selected==='Eliminar progreso'){await progreso.eliminar(Number(await ask('ID registro de progreso:')));console.log(chalk.green('Registro eliminado.'));}
    else if(selected==='Crear plan nutricional'){const d=await inquirer.prompt([{name:'cliente_id',message:'ID cliente:',validate:v=>Number(v)>0||'ID inválido'},{name:'plan_id',message:'ID plan de entrenamiento:',validate:v=>Number(v)>0||'ID inválido'},{name:'nombre',message:'Nombre:'},{name:'objetivo',message:'Objetivo (opcional):'},{name:'fecha_inicio',message:'Fecha inicio (AAAA-MM-DD):'},{name:'fecha_fin',message:'Fecha fin (AAAA-MM-DD, opcional):'}]);console.log(chalk.green('Plan nutricional creado. ID: '+await nutricion.crearPlan({...d,objetivo:d.objetivo||null,fecha_fin:d.fecha_fin||null},u)));}
    else if(selected==='Listar planes nutricionales')console.table(await nutricion.listarPlanes(Number(await ask('ID cliente:'))));
    else if(selected==='Agregar alimento'){const d=await inquirer.prompt([{name:'plan_nutricional_id',message:'ID plan nutricional:',validate:v=>Number(v)>0||'ID inválido'},{type:'list',name:'dia_semana',message:'Día:',choices:['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO']},{type:'list',name:'tiempo_comida',message:'Comida:',choices:['DESAYUNO','ALMUERZO','MERIENDA','CENA']},{name:'nombre',message:'Alimento:'},{name:'porcion',message:'Porción (opcional):'},{name:'calorias',message:'Calorías (opcional):'}]);console.log(chalk.green('Alimento agregado. ID: '+await nutricion.agregarAlimento({...d,porcion:d.porcion||null,calorias:d.calorias||null})));}
    else if(selected==='Reporte nutricional semanal'){const id=Number(await ask('ID plan nutricional:'));console.table(await nutricion.listarAlimentos(id));console.table(await nutricion.reporteSemanal(id));}
  else if(selected==='Registrar ingreso'||selected==='Registrar egreso'){const d=await inquirer.prompt([{name:'concepto',message:'Concepto:'},{name:'monto',message:'Monto:',validate:v=>Number(v)>0||'Debe ser mayor que cero'},{name:'fecha',message:'Fecha (AAAA-MM-DD):'}]);console.log('ID: '+await finanzas.registrar({...d,tipo:selected==='Registrar ingreso'?'INGRESO':'EGRESO'},u));}
  else if(selected==='Ver movimientos'||selected==='Ver balance'){const f=await inquirer.prompt([{name:'desde',message:'Desde (AAAA-MM-DD, opcional):'},{name:'hasta',message:'Hasta (AAAA-MM-DD, opcional):'},{name:'clienteId',message:'ID cliente (opcional):'}]);const filtros={desde:f.desde||null,hasta:f.hasta||null,clienteId:f.clienteId?Number(f.clienteId):null};if(selected==='Ver movimientos')console.table(await finanzas.listar(filtros,u));else console.table([await finanzas.balance(filtros,u)]);}
  else if(selected==='Reporte financiero mensual'){await ejecutarReporteFinanciero(finanzas,clientes,u);}
   else done=true;
  }catch(e){console.log(chalk.red('Error: '+e.message));}
  if(!done)await ask('Presiona Enter para continuar');
 }
}
try{
 await pool.query('SELECT 1'); console.log(chalk.green('Conexión a MySQL correcta.'));
 let again=true;
 while(again){const d=await inquirer.prompt([{name:'correo',message:'Correo:'},{type:'password',name:'password',message:'Contraseña:',mask:'*'}]);try{const u=await auth.login(d.correo,d.password);await menu(u);}catch(e){console.log(chalk.red(e.message));}again=(await inquirer.prompt([{type:'confirm',name:'again',message:'¿Iniciar otra sesión?',default:false}])).again;}
}catch(e){console.error(chalk.red('No se pudo iniciar: '+e.message));console.error('Verifica MySQL y las variables DB_HOST, DB_USER, DB_PASSWORD y DB_NAME.');}
finally{await pool.end();}

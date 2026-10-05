import inquirer from 'inquirer';
import chalk from 'chalk';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const dinero = valor => `Q ${Number(valor).toFixed(2)}`;

export async function ejecutarReporteFinanciero(finanzas, clientes, usuario) {
  const anioActual = new Date().getFullYear();

  const { anio, mes } = await inquirer.prompt([
    {
      type: 'input',
      name: 'anio',
      message: 'Año del reporte:',
      default: String(anioActual),
      validate: valor => {
        const valido = /^\d{4}$/.test(valor) &&
          Number(valor) >= 2000 &&
          Number(valor) <= anioActual + 1;
        return valido || 'Ingresa un año válido.';
      }
    },
    {
      type: 'list',
      name: 'mes',
      message: 'Mes del reporte:',
      choices: MESES.map((nombre, indice) => ({
        name: nombre,
        value: indice + 1
      }))
    }
  ]);

  const clientesActivos = await clientes.listar();
  const { clienteId } = await inquirer.prompt([{
    type: 'list',
    name: 'clienteId',
    message: '¿Para quién deseas generar el reporte?',
    choices: [
      { name: 'Todo el gimnasio', value: null },
      ...clientesActivos.map(cliente => ({
        name: `${cliente.id} - ${cliente.nombre} ${cliente.apellido}`,
        value: cliente.id
      }))
    ]
  }]);

  const reporte = await finanzas.reporteMensual({
    anio: Number(anio),
    mes,
    clienteId
  }, usuario);

  const nombreMes = MESES[mes - 1];
  const clienteSeleccionado = clientesActivos.find(cliente => cliente.id === clienteId);
  const filtroCliente = clienteSeleccionado
    ? `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`
    : 'Todo el gimnasio';

  console.log('\n' + chalk.bold.cyan('══════════════════════════════════════════════'));
  console.log(chalk.bold.cyan(`       REPORTE FINANCIERO - ${nombreMes.toUpperCase()} ${anio}`));
  console.log(chalk.gray(`       Filtro: ${filtroCliente}`));
  console.log(chalk.bold.cyan('══════════════════════════════════════════════'));

  console.table([
    { Tipo: chalk.green('INGRESO'), Concepto: 'Mensualidades', Monto: chalk.green(dinero(reporte.mensualidades)) },
    { Tipo: chalk.green('INGRESO'), Concepto: 'Sesiones individuales', Monto: chalk.green(dinero(reporte.sesionesIndividuales)) },
    { Tipo: chalk.green('INGRESO'), Concepto: 'Otros ingresos', Monto: chalk.green(dinero(reporte.otrosIngresos)) },
    { Tipo: chalk.green('TOTAL'), Concepto: 'Total de ingresos', Monto: chalk.green(dinero(reporte.totalIngresos)) },
    { Tipo: chalk.red('EGRESO'), Concepto: 'Gastos operativos', Monto: chalk.red(dinero(reporte.gastosOperativos)) },
    { Tipo: chalk.red('EGRESO'), Concepto: 'Suplementos', Monto: chalk.red(dinero(reporte.suplementos)) },
    { Tipo: chalk.red('EGRESO'), Concepto: 'Devoluciones', Monto: chalk.red(dinero(reporte.devoluciones)) },
    { Tipo: chalk.red('TOTAL'), Concepto: 'Total de egresos', Monto: chalk.red(dinero(reporte.totalEgresos)) }
  ]);

  const colorBalance = reporte.balanceNeto >= 0 ? chalk.green : chalk.red;
  console.log(chalk.bold('Balance neto: ') + colorBalance(dinero(reporte.balanceNeto)));
  console.log(chalk.gray('Los totales son calculados directamente en MySQL mediante SUM y CASE.\n'));
}

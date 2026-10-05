import { requireDateRange, requirePositiveId } from '../models/validation.js';

export class FinanzasRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async registrar(movimiento) {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      if (movimiento.contrato_id) {
        const [contratos] = await connection.execute(
          'SELECT cliente_id, estado FROM contratos WHERE id = ? FOR UPDATE',
          [movimiento.contrato_id]
        );

        if (!contratos.length) throw new Error('Contrato no encontrado.');
        if (contratos[0].estado !== 'ACTIVO') {
          throw new Error('No se pueden registrar movimientos en un contrato inactivo.');
        }
        if (movimiento.cliente_id && Number(movimiento.cliente_id) !== contratos[0].cliente_id) {
          throw new Error('El contrato no pertenece al cliente indicado.');
        }
        movimiento.cliente_id = contratos[0].cliente_id;
      }

      const [resultado] = await connection.execute(
        `INSERT INTO movimientos
          (cliente_id, contrato_id, tipo, concepto, monto, fecha, creado_por)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          movimiento.cliente_id, movimiento.contrato_id, movimiento.tipo,
          movimiento.concepto, movimiento.monto, movimiento.fecha, movimiento.creado_por
        ]
      );

      await connection.commit();
      return resultado.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  construirFiltros({ desde = null, hasta = null, clienteId = null } = {}) {
    const rango = requireDateRange({ desde, hasta });
    const filtros = [];
    const valores = [];

    if (rango.desde) { filtros.push('fecha >= ?'); valores.push(rango.desde); }
    if (rango.hasta) { filtros.push('fecha <= ?'); valores.push(rango.hasta); }
    if (clienteId !== null && clienteId !== undefined && clienteId !== '') {
      filtros.push('cliente_id = ?');
      valores.push(requirePositiveId(clienteId, 'El cliente'));
    }

    return {
      where: filtros.length ? ` WHERE ${filtros.join(' AND ')}` : '',
      valores
    };
  }

  async listar(filtros = {}) {
    const { where, valores } = this.construirFiltros(filtros);
    const [resultado] = await this.pool.execute(
      `SELECT * FROM movimientos${where} ORDER BY fecha DESC, id DESC`,
      valores
    );
    return resultado;
  }

  async balance(filtros = {}) {
    const { where, valores } = this.construirFiltros(filtros);
    const [resultado] = await this.pool.execute(
      `SELECT
        COALESCE(SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END), 0) AS ingresos,
        COALESCE(SUM(CASE WHEN tipo = 'EGRESO' THEN monto ELSE 0 END), 0) AS egresos
       FROM movimientos${where}`,
      valores
    );

    const ingresos = Number(resultado[0].ingresos);
    const egresos = Number(resultado[0].egresos);
    return { ingresos, egresos, balance: ingresos - egresos };
  }

  async reporteMensual({ anio, mes, clienteId = null }) {
    const inicio = `${anio}-${String(mes).padStart(2, '0')}-01`;
    const fin = new Date(Date.UTC(anio, mes, 0)).toISOString().slice(0, 10);
    const filtros = ['fecha BETWEEN ? AND ?'];
    const valores = [inicio, fin];

    if (clienteId !== null && clienteId !== undefined) {
      filtros.push('cliente_id = ?');
      valores.push(requirePositiveId(clienteId, 'El cliente'));
    }

    const [resultado] = await this.pool.execute(
      `SELECT
        COALESCE(SUM(CASE WHEN tipo = 'INGRESO' AND LOWER(concepto) LIKE '%mensual%' THEN monto ELSE 0 END), 0) AS mensualidades,
        COALESCE(SUM(CASE WHEN tipo = 'INGRESO' AND (LOWER(concepto) LIKE '%sesion%' OR LOWER(concepto) LIKE '%sesión%') THEN monto ELSE 0 END), 0) AS sesiones_individuales,
        COALESCE(SUM(CASE WHEN tipo = 'INGRESO' AND LOWER(concepto) NOT LIKE '%mensual%' AND LOWER(concepto) NOT LIKE '%sesion%' AND LOWER(concepto) NOT LIKE '%sesión%' THEN monto ELSE 0 END), 0) AS otros_ingresos,
        COALESCE(SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END), 0) AS total_ingresos,
        COALESCE(SUM(CASE WHEN tipo = 'EGRESO' AND LOWER(concepto) LIKE '%suplement%' THEN monto ELSE 0 END), 0) AS suplementos,
        COALESCE(SUM(CASE WHEN tipo = 'EGRESO' AND LOWER(concepto) LIKE '%devol%' THEN monto ELSE 0 END), 0) AS devoluciones,
        COALESCE(SUM(CASE WHEN tipo = 'EGRESO' AND LOWER(concepto) NOT LIKE '%suplement%' AND LOWER(concepto) NOT LIKE '%devol%' THEN monto ELSE 0 END), 0) AS gastos_operativos,
        COALESCE(SUM(CASE WHEN tipo = 'EGRESO' THEN monto ELSE 0 END), 0) AS total_egresos,
        COALESCE(SUM(CASE WHEN tipo = 'INGRESO' THEN monto WHEN tipo = 'EGRESO' THEN -monto ELSE 0 END), 0) AS balance_neto
       FROM movimientos
       WHERE ${filtros.join(' AND ')}`,
      valores
    );

    const fila = resultado[0];
    return {
      mensualidades: Number(fila.mensualidades),
      sesionesIndividuales: Number(fila.sesiones_individuales),
      otrosIngresos: Number(fila.otros_ingresos),
      totalIngresos: Number(fila.total_ingresos),
      gastosOperativos: Number(fila.gastos_operativos),
      suplementos: Number(fila.suplementos),
      devoluciones: Number(fila.devoluciones),
      totalEgresos: Number(fila.total_egresos),
      balanceNeto: Number(fila.balance_neto)
    };
  }
}

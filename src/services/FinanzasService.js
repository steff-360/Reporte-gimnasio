import { MovimientoFactory } from '../domain/MovimientoFactory.js';

export class FinanzasService {
  constructor(repo) { this.repo = repo; }

  requireAdmin(usuario) {
    if (usuario?.rol !== 'ADMIN') throw new Error('Acceso denegado: se requiere rol ADMIN.');
  }

  registrar(datos, usuario) {
    this.requireAdmin(usuario);
    return this.repo.registrar(MovimientoFactory.crear({ ...datos, creado_por: usuario.id }));
  }

  listar(filtros, usuario) { this.requireAdmin(usuario); return this.repo.listar(filtros); }
  balance(filtros, usuario) { this.requireAdmin(usuario); return this.repo.balance(filtros); }
  reporteMensual(filtros, usuario) { this.requireAdmin(usuario); return this.repo.reporteMensual(filtros); }
}

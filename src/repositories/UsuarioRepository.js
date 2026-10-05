export class UsuarioRepository {
 constructor(pool){this.pool=pool;}
 async buscarPorCorreo(correo){const [r]=await this.pool.execute('SELECT * FROM usuarios WHERE correo=? AND activo=TRUE',[correo]);return r[0]||null;}
}

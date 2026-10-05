import bcrypt from 'bcryptjs';
export class AuthService {
 constructor(repo){this.repo=repo;}
 async login(correo,password){const u=await this.repo.buscarPorCorreo(correo);if(!u||!(await bcrypt.compare(password,u.password_hash)))throw new Error('Correo o contraseña incorrectos.');return {id:u.id,nombre:u.nombre,correo:u.correo,rol:u.rol};}
}

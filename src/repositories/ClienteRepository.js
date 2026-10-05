export class ClienteRepository {
 constructor(pool){this.pool=pool;}
 async crear(c){const [r]=await this.pool.execute('INSERT INTO clientes(nombre,apellido,correo,telefono,edad) VALUES(?,?,?,?,?)',[c.nombre,c.apellido,c.correo,c.telefono,c.edad]);return r.insertId;}
 async listar({incluirInactivos=false}={}){const [r]=await this.pool.execute(`SELECT * FROM clientes${incluirInactivos?'':' WHERE activo=TRUE'} ORDER BY id DESC`);return r;}
 async buscar(id){const [r]=await this.pool.execute('SELECT * FROM clientes WHERE id=?',[id]);return r[0]||null;}
 async actualizar(id,c){const [r]=await this.pool.execute('UPDATE clientes SET nombre=?,apellido=?,correo=?,telefono=?,edad=? WHERE id=?',[c.nombre,c.apellido,c.correo,c.telefono,c.edad,id]);return r.affectedRows;}
 async desactivar(id){const [r]=await this.pool.execute('UPDATE clientes SET activo=FALSE WHERE id=?',[id]);return r.affectedRows;}
}

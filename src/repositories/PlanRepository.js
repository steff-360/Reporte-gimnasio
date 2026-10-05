export class PlanRepository {
 constructor(pool){this.pool=pool;}
 async crear(p){const [r]=await this.pool.execute('INSERT INTO planes(nombre,descripcion,duracion_dias,nivel,meta,precio) VALUES(?,?,?,?,?,?)',[p.nombre,p.descripcion,p.duracion_dias,p.nivel,p.meta,p.precio]);return r.insertId;}
 async listar({incluirInactivos=false}={}){const [r]=await this.pool.execute(`SELECT * FROM planes${incluirInactivos?'':' WHERE activo=TRUE'} ORDER BY id DESC`);return r;}
 async actualizar(id,p){const [r]=await this.pool.execute('UPDATE planes SET nombre=?,descripcion=?,duracion_dias=?,nivel=?,meta=?,precio=? WHERE id=?',[p.nombre,p.descripcion,p.duracion_dias,p.nivel,p.meta,p.precio,id]);return r.affectedRows;}
 async desactivar(id){const [r]=await this.pool.execute('UPDATE planes SET activo=FALSE WHERE id=?',[id]);return r.affectedRows;}
}

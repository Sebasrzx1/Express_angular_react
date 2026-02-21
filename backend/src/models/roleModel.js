const db = require("../config/conexion_db");
const { findAll } = require("./userModel");

const RoleModel = {
  //obtener todos los roles
  async findAll() {
    const query = `
        SELECT id_rol, nombre 
        FROM roles
        `;
    const [rows] = await db.execute(query);
    return rows;
  },

  //Obtener un rol por ID
  async findById(id) {
    const query = `
        SELECT id_rol, nombre 
        FROM roles 
        WHERE id_rol = ?
        `;

    const [rows] = await db.execute(query, [id]);
    return rows[0];
  },

  //Crear un nuevo rol
  async create(role) {
    const query = `
        INSERT INTO roles (nombre) VALUES
        (?)
        `;
    const [result] = await db.execute(query, [role.nombre]);
    return result.insertId;
  },

  //Actualiazr un rol
  async update(id, role) {
    const query = `
        UPDATE roles SET nombre = ?
        WHERE id_rol = ?
        `;
    const [result] = await db.execute(query, [role.nombre, id]);
    return result.affectedRows;
  },

  //Eliminar un rol
  async delete(id) {
    const query = `
        DELETE FROM roles WHERE id_rol = ?
        `;
    const [result] = await db.execute(query, [id]);
    return result.affectedRows;
  },

  //obtener array de permisos (strings) dado un id_rol
  //Retorna strings para middleware de autenticacion

  async getPermissionByRoleId(roleId) {
    const query = `
        SELECT p.nombre
        FROM permisos p
        INNER JOIN rol_permiso rp ON p.id_permiso = rp.id_permiso
        WHERE rp.id_rol = ?
        `;
    const [rows] = await db.execute(query, [roleId]);

    //Transformamos el resultado [{nombre: 'Crear'},{nombre: 'Leer'}]
    //a un array simple: ['crear', 'leer']

    return rows.map((row) => row.nombre);
  },

  //Obtener permisos completos con ID para edición
  async getPermissionsWithIdByRoleId(roleId) {
    const query = `
        SELECT p.id_permiso, p.nombre, p.descripcion
        FROM permisos p 
        INNER JOIN rol_permiso rp ON p.id_permiso = rp.id_permiso
        WHERE rp.id_rol = ?
        `;

    const [rows] = await db.execute(query, [roleId]);

    //Devolver los objetos completos con id, nomvre y descripcion
    return rows.map((row) => ({
      id: row.id_rol,
      nombre: row.nombre,
      descripcion: row.descripcion,
    }));
  },

  //Asignar permisos a un rol
  async assingPermissions(roleId, permissionsIds) {
    const connection = await db.getConnection(); //Iniciaremos esto para conectar con el poool y poder luego crear una transaccion de datos hacia la DB

    /* Flujo tipico de una transaccion.
            EJEMPLO:
            const connection = await db.getConnection();

try {
    await connection.beginTransaction();

    await connection.execute("QUERY 1");
    await connection.execute("QUERY 2");

    await connection.commit(); // Guardar cambios
} catch (error) {
    await connection.rollback(); // Deshacer todo
} finally {
    connection.release(); // Liberar conexión
} */
    try {
      await connection.beginTransaction(); //Desde ahora, no confirmes nada hasta que yo diga.

      await connection.execute("DELETE FROM rol_permiso WHERE id_rol = ?", [
        roleId,
      ]);

      //Asignar nuevos permisos
      if (permissionsIds && permissionsIds.length > 0) {
        const values = permissionsIds.map((pid) => [roleId, pid]);
        const placeholders = permissionsIds.map(() => "(?,?)").join(", ");
        const query = `INSERT INTO rol_permiso (id_rol, id_permiso) VALUES ${placeholders}`;
        await connection.execute(query, values.flat());
      }

      await connection.commit();
    } catch (error) {
      await connection.commit();
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = RoleModel
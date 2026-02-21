const db = require("../config/conexion_db");

const UserModel = {
  async findByEmail(email) {
    const query = `
        SELECT u.id_usuario, u.nombre, u.email, u.clave, u.id_rol, r.nombre as Nombre_rol
        FROM usuarios u
        JOIN roles r ON u.id_rol = r.id_rol
        WHERE EMAIL = ?
        
        `;
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  },

  async create(user) {
    const { nombre, email, clave, id_rol } = user;
    const query = `
            INSERT INTO usuarios (nombre, email, clave, id_rol)
            VALUES (?,?,?,?)
        `;

    const [result] = await db.execute(query, [nombre, email, clave, id_rol]);
    return result.insertId
},

async update(user, id){
    const {nombre, email, clave, id_rol} = user;
    const query = 
    `
    UPDATE usuarios 
    SET nombre = ?, email = ?, clave = ?, id_rol = ?
    WHERE id_usuario = ? 
    `

    const [result] = await db.execute(query, [nombre, email, clave, id_rol, id])
    return result.affectedRows;
},

async findById(id){
    const query = `
    SELECT u.id_usuario, u.nombre, u.email, u.clave, u.id_rol, r.nombre as nombre_rol
    FROM usuarios u 
    JOIN roles r ON u.id_rol = r.id_rol
    WHERE id_usuario = ?
    `
    const [rows] = await db.execute(query, [id])
    return rows[0]
},
async findAll(){
    const query = `
    SELECT u.id_usuario, u.nombre, u.email, u.clave, u.id_rol, r.nombre as nombre_rol
    FROM usuarios u 
    JOIN roles r ON u.id_rol = r.id_rol
    `

    const [rows] = await db.execute(query)
    return rows;
},

async deleteById(id){
    const query = `
    DELETE FROM usuarios WHERE id_usuario = ?
    `

    const [rows] = await db.execute(query, [id])
    return rows;
}
};

module.exports = UserModel;
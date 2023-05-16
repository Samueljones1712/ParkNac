const db = require('../config/database.js');
const { Respuestas } = require('../respuestas.js');

this.respuesta = new Respuestas();

const pool = new db.sql.ConnectionPool(db.config);

exports.getParqueNacional = async (req, res) => {

    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query("SELECT * FROM Parques;");
        pool.close(); // Cerrar conexión

        console.log(result.recordset);
        res.json(result.recordset)

    } catch (err) {
        this.respuesta.error_500();

        res.json(this.respuesta);
    }
}
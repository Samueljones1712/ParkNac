const db = require('../config/database.js');
const { Respuestas } = require('../respuestas.js');

this.respuesta = new Respuestas();

const pool = new db.sql.ConnectionPool(db.config);

exports.getEntradas = async (req, res) => {

    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query("SELECT * FROM Entradas;");
        pool.close(); // Cerrar conexión
        console.log(result.recordset)
        res.json(result.recordset)

    } catch (err) {
        this.respuesta.error_500();

        res.json(this.respuesta);
    }
}


exports.addEntradas = async (req, res) => {

    const { fecha, fk_idParque, fk_cedula, estado, fechaVencimiento, tarifa } = req.body;

    try {

        await pool.connect(); // Abrir conexión    

        const result = await pool.query("EXEC sp_insertEntrada '" + fk_cedula + "'," + [fk_idParque] + "," + [tarifa] + ",'Nacional';");

        this.respuesta.response.result = result.rowsAffected;
        console.log(this.respuesta);
        await pool.close(); // Cerrar conexión
        await res.json(this.respuesta);

    } catch (err) {
        console.error('Error al insertar la entrada', err);
        res.send(err)
    }

}

exports.updateEntradas = async (req, res) => {

    console.log(req.body);

    res.json(this.respuesta);
}

exports.deleteEntradas = async (req, res) => {

    console.log(req.params);

    res.json(this.respuesta);

}
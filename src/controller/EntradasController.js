const db = require('../config/database.js');
const { Respuestas } = require('../respuestas.js');

this.respuesta = new Respuestas();

const pool = new db.sql.ConnectionPool(db.config);

exports.getEntradas = async (req, res) => {

    console.log("Entradas metodo")

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

    console.log("LLego");
    console.log(req.body);

    res.json(this.respuesta);

}

exports.updateEntradas = async (req, res) => {

    console.log(req.body);

    res.json(this.respuesta);
}

exports.deleteEntradas = async (req, res) => {

    console.log(req.params);

    res.json(this.respuesta);

}
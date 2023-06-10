const jwt = require('jsonwebtoken');
const db = require('../config/database.js');
const { Respuestas } = require('../respuestas.js');
const mailer = require('../nodemailer.js');
const { setTimeout } = require('timers/promises');

this.respuesta = new Respuestas();

const pool = new db.sql.ConnectionPool(db.config);



exports.addControlInterno = async (req, res) => {


    const { detalle, fechaHora, id, ipAddress, pk_idUsuario } = req.body;

    try {

        await pool.connect(); // Abrir conexión   

        console.log("insert into RegistroActividad (pk_idUsuario,detalle,fechaHora,ipAddress) values (" + pk_idUsuario + ",'" + detalle + "'," + fechaHora + ",'" + ipAddress + "');");

        const result = await pool.query("insert into RegistroActividad (pk_idUsuario,detalle,fechaHora,ipAddress) values (" + pk_idUsuario + ",'" + detalle + "'," + fechaHora + ",'" + ipAddress + "');");

        this.respuesta.response.result = result.recordsets;
        // console.log(this.respuesta);
        await pool.close(); // Cerrar conexión
        await res.json(this.respuesta);

    } catch (err) {
        console.error('Error al insertar el Registro', err);
        res.send(err)
    }


}
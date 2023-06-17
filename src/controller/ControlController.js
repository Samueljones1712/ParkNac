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

        console.log("insert into RegistroActividad (pk_idUsuario,detalle,fechaHora,ipAddress) values (" + pk_idUsuario + ",getDate()," + fechaHora + ",'" + ipAddress + "');");

        const result = await pool.query("insert into RegistroActividad (pk_idUsuario,detalle,fechaHora,ipAddress) values (" + pk_idUsuario + ",'" + detalle + "',getDate(),'" + ipAddress + "');");
        this.respuesta.response.status = "ok";
        this.respuesta.response.result = result.recordsets;
        // console.log(this.respuesta);
        await pool.close(); // Cerrar conexión
        await res.json(this.respuesta);

    } catch (err) {
        console.error('Error al insertar el Registro', err);
        res.send(err)
    }
}


exports.getControlInterno = async (req, res) => {

    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query(" Select * from RegistroActividad;");
        pool.close(); // Cerrar conexión
        // console.log(result.recordset)
        res.json(result.recordset)

    } catch (err) {
        this.respuesta.error_500();

        res.json(this.respuesta);
    }
}
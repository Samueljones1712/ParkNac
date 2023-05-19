const jwt = require('jsonwebtoken');
const db = require('../config/database.js');
const { Respuestas } = require('../respuestas.js');
const mailer = require('../nodemailer.js');

this.respuesta = new Respuestas();

const pool = new db.sql.ConnectionPool(db.config);

exports.registerUser = async (req, res) => {

    const { cedula, nombre, apellido, contrasena, correo, Tipo } = req.body;

    console.log(cedula);

    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query("EXEC spRegistro '" + nombre + "','" + apellido + "','" + contrasena + "','" + correo + "','" + Tipo + "';");

        console.log(result.rowsAffected); // número de filas afectadas

        this.respuesta.response.result = result.rowsAffected;

        console.log(this.respuesta);

        await pool.close(); // Cerrar conexión

        await res.json(this.respuesta);

    } catch (err) {
        console.log(err);
        res.json(this.respuesta.error_500(err));
    }
}

exports.generateToken = (req, res) => {

    const { correo } = req.body;

    const token = jwt.sign({
        correo: correo
    }, process.env.SECRET_KEY || 'pepito123',
        { expiresIn: '9990000' })
    console.log(token)
    res.json({ token });
}



exports.login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {

        const resultado = await db.loginDB(correo, contrasena);

        if (resultado == "Correcto") {

            const numeroAleatorio = Math.floor(Math.random() * 90000) + 10000;
            this.respuesta.verifyCode(numeroAleatorio, correo);
            const msg = `Tu código de autenticación es: ${numeroAleatorio}`;
            mailer.sendAuthenticationCode(correo, msg, res, this.respuesta)

        } else {
            this.respuesta.error_500("El Correo o la contrasena es incorrecto");
            res.json(this.respuesta);
        }

    } catch (err) {
        this.respuesta.error_500(err);
        res.json(this.respuesta);
    }
}

exports.index = async (req, res) => {
    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query('SELECT * FROM usuarios');
        console.log(result.recordset);
        res.json({
            data: result.recordset
        })
        await pool.close(); // Cerrar conexión
    } catch (err) {
        console.error('Error al consultar usuarios', err);
        res.send(err)
    }
}


exports.edit = async (req, res) => {
    const { id, nombre, apellido } = req.body;

    try {
        await pool.connect();
        const result = await pool.query(
            `UPDATE usuarios SET nombre = '${nombre}', apellido = '${apellido}' WHERE id = ${id}`
        );
        console.log(result.rowsAffected); // número de filas afectadas

        await pool.close();
    } catch (err) {
        console.error('Error al actualizar el registro', err);
        res.send(err)
    }
}

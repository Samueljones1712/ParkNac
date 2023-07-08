const db = require('../config/database.js');
const { Respuestas } = require('../respuestas.js');
const mailer = require('../nodemailer.js');

this.respuesta = new Respuestas();

const pool = new db.sql.ConnectionPool(db.config);


// cantidad: { Cantidad: 2 },
// fechaVencimiento: '2023-06-23',
//     nombreParque: 'Parque nacional Volcán Arenal',
//         fechaGenerada: '2023-06-22'

exports.sendEntradaByCorreo = async (req, res) => {
    const { correo, cantidad, fechaVencimiento, nombreParque, fechaGenerada } = req.body;

    console.log(cantidad);

    this.respuesta.response.status = "ok";

    const msg = `Gracias por comprar un ticket para ` + nombreParque + ". \nFecha de reserva: " + fechaVencimiento + " \nCantidad de Campos Reservados: " + cantidad + " \nFecha generada: " + fechaGenerada;
    mailer.sendAuthenticationCode("samueljone01234@gmail.com", msg, "Entrada:" + fechaGenerada, res, this.respuesta);

}

exports.getEntradaByDate = async (req, res) => {

    const fechas = req.body;
    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query("select * from Entradas where Entradas.fecha>='" + fechas[0] + "' AND Entradas.fecha<='" + fechas[1] + " 23:59'");
        pool.close(); // Cerrar conexión
        // console.log(result.recordset)
        res.json(result.recordset)

    } catch (err) {
        this.respuesta.error_500();

        res.json(this.respuesta);
    }

}

exports.getEntradas = async (req, res) => {

    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query(" Select * from vista_entradas_parques_usuarios;");
        pool.close(); // Cerrar conexión
        // console.log(result.recordset)
        res.json(result.recordset)

    } catch (err) {
        this.respuesta.error_500();

        res.json(this.respuesta);
    }
}




exports.addEntrada = async (req, res) => {

    const { fecha, fk_idUsuario, fk_idParque, estado, id, fechaVencimiento, CantExtranjeros, CantNacionales, tarifaNacionales, tarifaExtranjeros, hora } = req.body;

    try {

        await pool.connect(); // Abrir conexión    

        const result = await pool.query("EXEC sp_insertEntrada '" + fk_idUsuario + "'," + [fk_idParque] + "," + [CantExtranjeros] + "," + [CantNacionales] + ", '" + [fechaVencimiento] + "', '" + [hora] + "' ;");
        this.respuesta.response.status = "ok";
        this.respuesta.response.result = result.rowsAffected;
        // console.log(this.respuesta);
        await pool.close(); // Cerrar conexión
        await res.json(this.respuesta);

    } catch (err) {
        console.error('Error al insertar la entrada', err);
        res.send(err)
    }

}

exports.updateEntradas = async (req, res) => {

    const { fecha, fk_idUsuario, fk_idParque, estado, id, fechaVencimiento, CantExtranjeros, CantNacionales, tarifaNacionales, tarifaExtranjeros, hora } = req.body;

    try {

        await pool.connect(); // Abrir conexión   

        console.log("EXEC sp_editEntrada " + id + "," + [fk_idParque] + ",'" + [fechaVencimiento] + "'," + [CantNacionales] + ", " + [CantExtranjeros] + "," + [tarifaNacionales] + "," + [tarifaExtranjeros] + " ,'" + [hora] + "' ;");

        const result = await pool.query("EXEC sp_editEntrada " + id + "," + [fk_idParque] + ",'" + [fechaVencimiento] + "'," + [CantNacionales] + ", " + [CantExtranjeros] + "," + [tarifaNacionales] + "," + [tarifaExtranjeros] + " ,'" + [hora] + "' ;");
        this.respuesta.response.status = "ok";
        this.respuesta.response.result = result.rowsAffected;
        // console.log(this.respuesta);
        await pool.close(); // Cerrar conexión
        await res.json(this.respuesta);

    } catch (err) {
        console.error('Error al insertar la entrada', err);
        res.send(err)
    }

}

exports.deleteEntradas = async (req, res) => {

    console.log(req.params);

    const { Id } = req.params;


    try {

        await pool.connect(); // Abrir conexión    

        console.log("sp_deleteEntrada " + Id + ";");

        const result = await pool.query("sp_deleteEntrada " + Id + ";");

        this.respuesta.response.result = result.rowsAffected;
        console.log(this.respuesta);
        await pool.close(); // Cerrar conexión
        await res.json(this.respuesta);

    } catch (err) {
        console.error('Error al insertar la entrada', err);
        res.send(err)
    }

}
exports.getEntradasParque = async (req, res) => {
    const { fk_idParque, fechaVencimiento } = req.body;

    try {
        await pool.connect();
        const query = "SELECT SUM(Entradas.cantidadExtranjeros+Entradas.cantidadNacionales) AS Cantidad FROM Entradas WHERE Entradas.fk_idParque =" + fk_idParque + " AND Entradas.fechaVencimiento ='" + fechaVencimiento + "'";
        console.log(query);
        const result = await pool.query(query);

        await pool.close();
        console.log(result.recordset);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error en el count");
        res.send(err);
    }
}
const jwt = require('jsonwebtoken');
const db = require('../config/database.js');
const { Respuestas } = require('../respuestas.js');
const mailer = require('../nodemailer.js');


this.respuesta = new Respuestas();

const pool = new db.sql.ConnectionPool(db.config);

exports.registerUser = async (req, res) => {

    const { correo, contrasena } = req.body;

    console.log(req.body);


    res.json(this.respuesta);

}

exports.generateToken = (req, res) => {

    const { correo } = req.body;

    const token = jwt.sign({
        correo: correo
    }, process.env.SECRET_KEY || 'pepito123', {
        expiresIn: '10000'
    })
    console.log(token)
    res.json({ token });
}

exports.login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query("SELECT * FROM usuarios where correo='" + correo + "';");
        pool.close(); // Cerrar conexión

        if (result.recordset[0].correo) {

            if (result.recordset[0].contrasena == contrasena) {

                const numeroAleatorio = Math.floor(Math.random() * 90000) + 10000;

                this.respuesta.verifyCode(numeroAleatorio, result.recordset[0]);
                const msg = `Tu código de autenticación es: ${numeroAleatorio}`;
                mailer.sendAuthenticationCode(correo, msg, res, this.respuesta)

            } else if (result.recordset[0].contrasena != contrasena) {

                this.respuesta.error_401();
                res.json(this.respuesta)
            }
        }
    } catch (err) {
        this.respuesta.error_402();

        res.json(this.respuesta);
    }
}

async function saveToken(token, id) {
    try {
        await pool.connect();
        const result = await pool.query(
            `UPDATE usuarios SET token = '${token}' WHERE id = ${id}`
        );
        console.log(result.rowsAffected); // número de filas afectadas
        pool.close();
    } catch (err) {
        console.error('Error al actualizar el registro', err);
        throw err;
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




exports.delete = async (req, res) => {
    const { id } = req.query;

    try {
        await pool.connect();
        const result = await pool.query(
            `DELETE FROM usuarios WHERE id = ${id}`
        );
        console.log(result.rowsAffected); // número de filas afectadas
        res.json({
            message: `El registro con id ${id} ha sido eliminado correctamente`
        });
        await pool.close();
    } catch (err) {
        console.error('Error al eliminar el registro', err);
        res.send(err)
    }
}


function addToken(token, id) {
    try {
        pool.connect();
        const result = pool.query(
            `UPDATE usuarios SET token = '${token}' WHERE id = ${id}`
        );
        console.log(result.rowsAffected); // número de filas afectadas

        pool.close();
    } catch (err) {
        console.error('Error al actualizar el registro', err);
        res.send(err)
    }
}









// exports.index = async (req, res) => {

//     const pool = new db_conection.ConnectionPool(db_conection.config);
//     pool.connect().then(() => {
//         //simple query
//         pool.request().query('select * from Persona', (err, result) => {
//             if (err) res.send(err)
//             else {
//                 return res.json({
//                     data: result.recordset
//                 })
//             }
//         })
//         db_conection.close();

//     })
//     console.log('ending sql');

// }

//     db_conection.sql.connect(db_conection.config, function (err) {
//         if (err) {
//             console.log(err);
//             res.json("Un error es:", err);
//         } else {
//             // create Request object
//             res.json("Entro 1");
//             var request = new db_conection.sql.Request();
//             res.json("Entro 2");
//             // query to the database and get the records
//             request.query('SELECT * FROM Prueba2', function (err, result) {

//                 if (err) {
//                     res.json("Error es ", err);
//                     console.log(err);
//                 } else {
//                     res.json(result);
//                     // send records as a response
//                     res.json(result.recordsets[0]);
//                 }
//             });
//         }
//     });
// };








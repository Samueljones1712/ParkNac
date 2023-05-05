const db = require('../config/database.js');
const { Respuestas } = require('../respuestas.js');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

this.respuesta = new Respuestas();

const pool = new db.sql.ConnectionPool(db.config);

exports.login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query("SELECT * FROM usuarios where correo='" + correo + "';");
        pool.close(); // Cerrar conexión

        if (result.recordset[0].correo) {

            if (result.recordset[0].contrasena == contrasena) {
                /*
                const payload = { user: correo };
                const secret = contrasena;
                const token = jwt.sign(payload, secret, { expiresIn: '1h' });
*/
                // this.respuesta.token(token, result.recordset[0]);
                //this.respuesta.response.result = ( );

                const num = Math.floor(Math.random() * 90000) + 10000;

                const secret = 'claveSecreta';

                const token = jwt.sign({ num }, secret, { expiresIn: '1h' });

                this.respuesta.response.status = "ok";
                this.respuesta.response.result = "token?";

                console.log(this.respuesta)

                saveToken(token, result.recordset[0].id)

                console.log(`UPDATE usuarios SET token = '${token}' WHERE id = ${result.recordset[0].id}`); // número de filas afectadas

                res.json(this.respuesta);

            } else if (result.recordset[0].contrasena != contrasena) {

                this.respuesta.error_401();

                res.json(this.respuesta)
            }

        }
    } catch (err) {
        this.respuesta.error_402();

        res.json(err);
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


function correo() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'Samuelferrari01234@gmail.com',
            pass: 'SamuelJones2001.'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nombre remitente" <Samuelferrari01234@gmail.com>', // dirección del remitente
        to: 'Samuelferrari123@outlook.es', // lista de destinatarios separados por coma
        subject: 'Asunto del correo', // Asunto del correo
        text: 'Contenido del correo en formato texto plano', // Contenido del correo en formato texto plano
        html: '<p>Contenido del correo en formato HTML</p>' // Contenido del correo en formato HTML
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });


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








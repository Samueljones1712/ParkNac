const db = require('../config/database.js');

const pool = new db.sql.ConnectionPool(db.config);

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
    const { id, nombre, email } = req.body;
    try {
        await pool.connect();
        const result = await pool.query(
            `UPDATE usuarios SET nombre = '${nombre}', email = '${email}' WHERE id = ${id}`
        );
        console.log(result.rowsAffected); // número de filas afectadas
        res.json({
            message: `El registro con id ${id} ha sido actualizado correctamente`
        });
        await pool.close();
    } catch (err) {
        console.error('Error al actualizar el registro', err);
        res.send(err)
    }
}


exports.delete = async (req, res) => {
    const { id } = req.params;
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








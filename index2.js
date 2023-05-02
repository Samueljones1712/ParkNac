const sql = require('mssql')

const config = {
    user: 'informatica123',
    password: 'informatica123',
    server: 'PC-LAPTOP',
    database: 'prueba',
    options: {
        trustedconection: false,
        enableArithAbort: true,
        encrypt: false,
    }
}

const pool = new sql.ConnectionPool(config)

async function consultarPersonas() {
    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query('SELECT * FROM Prueba2');
        console.log(result.recordset);
        await pool.close(); // Cerrar conexión
    } catch (err) {
        console.error('Error al consultar personas', err);
    }
}

consultarPersonas();

// pool.connect(err => {
//     if (err) {
//         console.error('Error de conexión:', err)
//     } else {
//         console.log('Conectado a la base de datos')

//         const request = pool.request()

//         if (pool.connected) {
//             request.query('SELECT * FROM Prueba2', (err, result) => {
//                 if (err) {
//                     console.error('Error en la consulta:', err)
//                 } else {
//                     console.log(result.recordset)
//                 }
//             })
//         } else {
//             console.error('La conexión no está abierta')
//         }
//     }
// })






const sql = require('mssql')

const config = {
    user: 'informatica123',
    password: 'informatica123',
    server: 'PC-LAPTOP',
    database: 'ParqueNacional',
    options: {
        trustedconection: false,
        enableArithAbort: true,
        encrypt: false,
    }
}


exports.config = config;
exports.sql = sql
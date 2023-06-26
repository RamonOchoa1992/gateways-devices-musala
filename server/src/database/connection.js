import sql from "mssql";
import { USER, PASSWORD, SERVER, DATABASE } from "../config.js"

const dbSettings = {
    user: USER,
    password: PASSWORD,
    server: SERVER,
    database: DATABASE,
    options: {
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
        },
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

const getConnection = async () => {
    const pool = await sql.connect(dbSettings);
    return pool;
}

export default getConnection;
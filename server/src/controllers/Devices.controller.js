import getConnection from "../database/connection.js"
import sql from "mssql";

export const getDevices = async (req, res) => {
    const { id } = req.params;
    const idGat = +id;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("idGat", sql.Int, idGat)
            .query("SELECT idP, vendor, convert(varchar,dateCreated,103) as dateCreated, status, idGat FROM  Peripheral where idGat = @idGat")
        res.json(result.recordset)
    } catch (error) {
        return res.status(500).json({
            message: "Error Connection!"
        })
    }
}

export const insertDevice = async (req, res) => {
    const { vendor, idGat } = req.body;

    try {
        const pool = await getConnection();
        const query1 = await pool.request()
            .input("idGat", sql.Int, idGat)
            .query("SELECT COUNT(*) FROM Peripheral where idGat = @idGat");

        const deviceCounter = query1.recordset[0][""];

        if (deviceCounter >= 10) {
            return res.status(422).send({
                message: "No more than 10 peripheral devices are allowed for a gateway."
            })
        }

        const query2 = await pool.request()
            .input("vendor", sql.VarChar(100), vendor)
            .input("dataC", sql.DateTimeOffset, new Date())
            .input("idGat", sql.Int, idGat)
            .query("INSERT INTO Peripheral (vendor, dateCreated, status, idGat) VALUES (@vendor, @dataC, 0, @idGat)");

        const getLastIndex = async () => {
            const query3 = await pool.request().query("SELECT TOP(1) idP from Peripheral order by idP desc");
            return query3["recordset"][0]["idP"];
        }

        const isInserted = query2["rowsAffected"][0];

        isInserted
            ? res.send({
                idP: await getLastIndex(),
                vendor,
                status: 0,
                idGat
            })
            : res.status(500).send({
                message: "It was a problem inserting this device."
            })
    } catch (error) {
        return res.status(500).json({
            message: "Error Connection!"
        })
    }

}

export const deleteDevice = async (req, res) => {
    const { id } = req.params;
    const idP = +id;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("idP", sql.Int, idP)
            .query("DELETE FROM Peripheral where idP = @idP")

        const isDeleted = result["rowsAffected"][0];

        isDeleted
            ? res.send({
                message: "Device Deleted!"
            })
            : res.status(500).send({
                message: "It was a problem deleting this device."
            })

    } catch (error) {
        return res.status(500).json({
            message: "Error Connection!"
        })
    }
}

export const putStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const idP = +id;
    try {
        const pool = await getConnection();
        const query1 = await pool.request()
            .input("idP", sql.Int, idP)
            .input("status", sql.Bit, +status ? 0 : 1)
            .query("UPDATE Peripheral set status = @status where idP = @idP");

        const isUpdated = query1["rowsAffected"][0];

        isUpdated
            ? res.send({
                message: "Status Updated!"
            })
            : res.status(500).send({
                message: "It was a problem updating this status."
            })

    } catch (error) {
        return res.status(500).json({
            message: "Error Connection!"
        })
    }
}
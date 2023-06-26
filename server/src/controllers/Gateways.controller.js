import getConnection from "../database/connection.js"
import sql from "mssql";

export const getGateways = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT * FROM  Gateway")
        res.json(result.recordset)
    } catch (error) {
        return res.status(500).json({
            message: "Error Connection!"
        })
    }
}

export const getGatewaysById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.request().input("id", sql.Int, id).query("SELECT * FROM  Gateway where idGat = @id")
        res.json(result.recordset[0])
    } catch (error) {
        return res.status(500).json({
            message: "Error Connection!"
        })
    }
}

export const insertGateway = async (req, res) => {
    const { serialNumber, humanName, ipAddress } = req.body;

    try {
        const pool = await getConnection();
        const query1 = await pool.request().input("sn", sql.VarChar(50), serialNumber).query("SELECT COUNT(*) FROM  Gateway where serialNumber = @sn");

        const serialCounter = query1.recordset[0][""];

        if (serialCounter > 0) {
            return res.status(422).send({
                message: "The serial number you are entering belongs to another gateway. It must be a unique serial number."
            })
        }

        if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddress)) {
            return res.status(422).send({
                message: "The IPv4 address you are entering is not valid."
            })
        }

        const query2 = await pool.request()
            .input("sn", sql.VarChar(50), serialNumber)
            .input("hn", sql.VarChar(100), humanName)
            .input("ia", sql.VarChar(15), ipAddress)
            .query("INSERT INTO Gateway (serialNumber, humanName, ipAddress) VALUES (@sn, @hn, @ia)");

        const getLastIndex = async () => {
            const query3 = await pool.request().query("SELECT TOP(1) idGat from Gateway order by idGat desc");
            return query3["recordset"][0]["idGat"];
        }

        const isInserted = query2["rowsAffected"][0];

        isInserted
            ? res.send({
                idGat: await getLastIndex(),
                serialNumber,
                humanName,
                ipAddress
            })
            : res.status(500).send({
                message: "It was a problem inserting this gateway."
            })
    } catch (error) {
        return res.status(500).json({
            message: "Error Connection!"
        })
    }

}

export const updateGateway = async (req, res) => {

    const { serialNumber, humanName, ipAddress } = req.body;
    const { id } = req.params;
    const idGat = +id;

    try {
        const pool = await getConnection();
        const query1 = await pool.request()
            .input("idGat", sql.Int, idGat)
            .input("sn", sql.VarChar(50), serialNumber)
            .query("SELECT COUNT(*) FROM Gateway where serialNumber = @sn and idGat <> @idGat");

        const serialCounter = query1.recordset[0][""];

        if (serialCounter > 0) {
            return res.status(422).send({
                message: "The serial number you are entering belongs to another gateway. It must be a unique serial number."
            })
        }

        if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddress)) {
            return res.status(422).send({
                message: "The IPv4 address you are entering is not valid."
            })
        }

        const query2 = await pool.request()
            .input("idGat", sql.Int, idGat)
            .input("sn", sql.VarChar(50), serialNumber)
            .input("hn", sql.VarChar(100), humanName)
            .input("ia", sql.VarChar(15), ipAddress)
            .query("UPDATE Gateway set serialNumber = @sn, humanName = @hn, ipAddress = @ia  where idGat = @idGat");

        const isUpdated = query2["rowsAffected"][0];

        isUpdated
            ? res.send({
                message: "Gateway Updated!"
            })
            : res.status(500).send({
                message: "It was a problem updating this gateway."
            })

    } catch (error) {
        return res.status(500).json({
            message: "Error Connection!"
        })
    }
}

export const deleteGateway = async (req, res) => {
    const { id } = req.params;
    const idGat = +id;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("idGat", sql.Int, idGat)
            .query("DELETE FROM Gateway where idGat = @idGat")

        const isDeleted = result["rowsAffected"][0];

        isDeleted
            ? res.send({
                message: "Gateway Deleted!"
            })
            : res.status(500).send({
                message: "It was a problem deleting this gateway."
            })

    } catch (error) {
        return res.status(500).json({
            message: "Error Connection!"
        })
    }
}
import express from "express";
import cors from "cors";
import Gateways from "./routes/Gateways.routes.js";
import Devices from "./routes/Devices.routes.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api", Gateways);
app.use("/api", Devices);

app.use((req, res, next) => {
    res.status(404).json({
        message: "Endpoint not found"
    })
})

export default app;
import { Router } from "express"
import { deleteDevice, getDevices, insertDevice, putStatus } from "../controllers/Devices.controller.js";

const router = Router();

router.get("/devices/:id", getDevices)
router.post("/devices", insertDevice)
router.put("/devices/:id", putStatus)
router.delete("/devices/:id", deleteDevice)

export default router;
import { Router } from "express"
import { getGateways, getGatewaysById, insertGateway, updateGateway, deleteGateway } from "../controllers/Gateways.controller.js";

const router = Router();

router.get("/gateways", getGateways)

router.get("/gateways/:id", getGatewaysById)

router.post("/gateways", insertGateway)

router.put("/gateways/:id", updateGateway)

router.delete("/gateways/:id", deleteGateway)

export default router;
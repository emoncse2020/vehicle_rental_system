import auth from "../../middleware/auth";

import express from "express";
import { vehicleControllers } from "./vehicle.controller";

const router = express.Router();

// app.use("/api/v1/vehicles", vehicleRoutes)

// routes -> controller -> service

router.post("/", auth("admin"), vehicleControllers.createVehicles);

router.get("/", vehicleControllers.getVehicles);

router.get("/:vehicleId", vehicleControllers.getSingleVehicles);

router.put("/:vehicleId", auth("admin"), vehicleControllers.updateVehicles);

router.delete("/:vehicleId", auth("admin"), vehicleControllers.deleteVehicles);

export const vehicleRoutes = router;

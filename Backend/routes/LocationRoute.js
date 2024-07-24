import { Router } from "@feathersjs/express";
import { LocationController } from "../controllers/Location.js";
import { verifyRoleAndPermission, verifyUser } from "../middleware/AuthUser.js";

const router = Router();

router.get("/location", verifyUser, verifyRoleAndPermission("Location", "read"), LocationController.getAllLocation);
router.get("/location/:id", verifyUser, verifyRoleAndPermission("Location", "read"), LocationController.getLocationByIdNo);
router.post("/location", verifyUser, verifyRoleAndPermission("Location", "create"), LocationController.createLocation);
router.put("/location/:id", verifyUser, verifyRoleAndPermission("Location", "update"), LocationController.updateLocation);
router.delete("/location/:id", verifyUser, verifyRoleAndPermission("Location", "delete"), LocationController.deleteLocation);

export default router;

import { Router } from "@feathersjs/express";
import { UnitController } from "../controllers/Unit.js";
import { verifyRoleAndPermission, verifyUser } from "../middleware/AuthUser.js";

const router = Router();

router.get("/unit", verifyUser, verifyRoleAndPermission("Unit", "read"), UnitController.getAllUnit);
router.get("/unit/:id", verifyUser, verifyRoleAndPermission("Unit", "read"), UnitController.getUnitByIdNo);
router.post("/unit", verifyUser, verifyRoleAndPermission("Unit", "create"), UnitController.createUnit);
router.put("/unit/:id", verifyUser, verifyRoleAndPermission("Unit", "update"), UnitController.updateUnit);
router.delete("/unit/:id", verifyUser, verifyRoleAndPermission("Unit", "delete"), UnitController.deleteUnit);

export default router;

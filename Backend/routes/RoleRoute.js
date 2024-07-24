import { Router } from "@feathersjs/express";
import { RoleController } from "../controllers/Role.js";
import { verifyRoleAndPermission, verifyUser } from "../middleware/AuthUser.js";

const router = Router();

router.get("/role", verifyUser, verifyRoleAndPermission("role", "read"), RoleController.getAllRole);
router.get("/role/:id", verifyUser, verifyRoleAndPermission("role", "read"), RoleController.getRoleById);
router.post("/role", verifyUser, verifyRoleAndPermission("role", "create"), RoleController.createRole);
router.put("/role/:id", verifyUser, verifyRoleAndPermission("role", "update"), RoleController.updateRole);
router.delete("/role/:id", verifyUser, verifyRoleAndPermission("role", "delete"), RoleController.deleteRole);

export default router;

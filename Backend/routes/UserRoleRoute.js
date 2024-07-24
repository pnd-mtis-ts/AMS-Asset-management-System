import { Router } from "@feathersjs/express";
import { UserRoleController } from "../controllers/UserRole.js";
import { verifyRoleAndPermission, verifyUser } from "../middleware/AuthUser.js";

const router = Router();

router.post("/user-role", verifyUser, verifyRoleAndPermission("user_role", "create"), UserRoleController.createUserRole);
router.get("/user-role", verifyUser, verifyRoleAndPermission("user_role", "read"), UserRoleController.getAllUserRoles);
router.get("/user-role/user/:userId", verifyUser, verifyRoleAndPermission("user_role", "read"), UserRoleController.findOneUserRoleByUserId);
router.get("/user-role/role/:roleId", verifyUser, verifyRoleAndPermission("user_role", "read"), UserRoleController.findOneUserRoleByRoleId);
router.put("/user-role/:userId", verifyUser, verifyRoleAndPermission("user_role", "update"), UserRoleController.updateUserRoleByUserId);
router.delete("/user-role", verifyUser, verifyRoleAndPermission("user_role", "delete"), UserRoleController.deleteUserRole);

export default router;

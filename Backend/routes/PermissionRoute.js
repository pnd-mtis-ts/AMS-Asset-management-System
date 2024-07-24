import { Router } from "@feathersjs/express";
import { permissionController } from "../controllers/Permission.js";
import { rolePermissionController } from "../controllers/RolePermission.js";
import { verifyRoleAndPermission, verifyUser } from "../middleware/AuthUser.js";

const router = Router();

router.get("/permissions", verifyUser, verifyRoleAndPermission("permission", "read"), permissionController.getAllPermissions);
router.get("/permissions/grouped", verifyUser, verifyRoleAndPermission("permission", "read"), permissionController.getPermissionByResourceAndAction);
router.get("/permissions/:id", verifyUser, verifyRoleAndPermission("permission", "read"), permissionController.getPermissionById);
router.post("/permissions", verifyUser, verifyRoleAndPermission("permission", "create"), permissionController.createPermission);
router.put("/permissions/:id", verifyUser, verifyRoleAndPermission("permission", "update"), permissionController.updatePermission);
router.delete("/permissions/:id", verifyUser, verifyRoleAndPermission("permission", "delete"), permissionController.deletePermission);

router.post("/role-permissions", verifyUser, verifyRoleAndPermission("role_permission", "create"), rolePermissionController.createRolePermission);
router.get("/role-permissions", verifyUser, verifyRoleAndPermission("role_permission", "read"), rolePermissionController.getAllRolePermissions);
router.get("/role-permissions/:roleId", verifyUser, verifyRoleAndPermission("role_permission", "read"), rolePermissionController.getRolePermissionsById);
router.put("/role-permissions/:roleId/:permissionId", verifyUser, verifyRoleAndPermission("role_permission", "update"), rolePermissionController.updateRolePermission);
router.delete("/role-permissions", verifyUser, verifyRoleAndPermission("role_permission", "delete"), rolePermissionController.deleteRolePermission);

export default router;

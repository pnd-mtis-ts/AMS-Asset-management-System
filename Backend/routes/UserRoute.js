import { Router } from "@feathersjs/express";
import { UserController } from "../controllers/Users.js";
import { verifyRoleAndPermission, verifyUser } from "../middleware/AuthUser.js";

const router = Router();

router.get("/users", verifyUser, verifyRoleAndPermission("users", "read"), UserController.getUser);
router.get("/users/:id", verifyUser, verifyRoleAndPermission("users", "read"), UserController.getUserById);
router.post("/users", verifyUser, verifyRoleAndPermission("users", "create"), UserController.createUser);
router.put("/users/:id", verifyUser, verifyRoleAndPermission("users", "update"), UserController.updateUser);
router.delete("/users/:id", verifyUser, verifyRoleAndPermission("users", "delete"), UserController.deleteUser);

export default router;

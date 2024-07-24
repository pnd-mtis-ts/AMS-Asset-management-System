import { Router } from "@feathersjs/express";
import { EntityController } from "../controllers/Entity.js";
import { verifyRoleAndPermission, verifyUser } from "../middleware/AuthUser.js";

const router = Router();

router.get("/entity", verifyUser, verifyRoleAndPermission("Entity", "read"), EntityController.getAllEntity);
router.get("/entity/:id", verifyUser, verifyRoleAndPermission("Entity", "read"), EntityController.getEntityByIdNo);
router.post("/entity", verifyUser, verifyRoleAndPermission("Entity", "create"), EntityController.createEntity);
router.put("/entity/:id", verifyUser, verifyRoleAndPermission("Entity", "update"), EntityController.updateEntity);
router.delete("/entity/:id", verifyUser, verifyRoleAndPermission("Entity", "delete"), EntityController.deleteEntity);

export default router;

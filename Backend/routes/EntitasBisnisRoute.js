import { Router } from "@feathersjs/express";
import { EntitasBisnisController } from "../controllers/EntitasBisnis.js";
import { verifyRoleAndPermission, verifyUser } from "../middleware/AuthUser.js";

const router = Router();

router.get("/entitas-bisnis", verifyUser, verifyRoleAndPermission("EntitasBisnis", "read"), EntitasBisnisController.getAllEntitasBisnis);
router.get("/entitas-bisnis/:id", verifyUser, verifyRoleAndPermission("EntitasBisnis", "read"), EntitasBisnisController.getEntitasBisnisByIdNo);
router.post("/entitas-bisnis", verifyUser, verifyRoleAndPermission("EntitasBisnis", "create"), EntitasBisnisController.createEntitasBisnis);
router.put("/entitas-bisnis/:id", verifyUser, verifyRoleAndPermission("EntitasBisnis", "update"), EntitasBisnisController.updateEntitasBisnis);
router.delete("/entitas-bisnis/:id", verifyUser, verifyRoleAndPermission("EntitasBisnis", "delete"), EntitasBisnisController.deleteEntitasBisnis);

export default router;

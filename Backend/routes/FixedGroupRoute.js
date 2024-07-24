import { Router } from "@feathersjs/express";
import { FixedGroupController } from "../controllers/FixedGroup.js";
import { verifyRoleAndPermission, verifyUser } from "../middleware/AuthUser.js";

const router = Router();

router.get("/fixed-group", verifyUser, verifyRoleAndPermission("FixedGroup", "read"), FixedGroupController.getAllFixedGroup);
router.get("/fixed-group/:id", verifyUser, verifyRoleAndPermission("FixedGroup", "read"), FixedGroupController.getFixedGroupById);
router.post("/fixed-group", verifyUser, verifyRoleAndPermission("FixedGroup", "create"), FixedGroupController.createFixedGroup);
router.put("/fixed-group/:id", verifyUser, verifyRoleAndPermission("FixedGroup", "update"), FixedGroupController.updateFixedGroup);
router.delete("/fixed-group/:id", verifyUser, verifyRoleAndPermission("FixedGroup", "delete"), FixedGroupController.deleteFixedGroup);

export default router;

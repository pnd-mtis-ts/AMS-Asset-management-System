import { Router } from "@feathersjs/express";
import { FixedController } from "../controllers/Fixed.js";
import { verifyRoleAndPermission, verifyUser } from "../middleware/AuthUser.js";
import { generateFixedAndInvNo } from "../utils/utility.js";

const router = Router();

router.post("/fixed", verifyUser, verifyRoleAndPermission("Fixed", "create"), FixedController.createFixedWithDocument);

router.post("/generateFixedNoAndInvNo", verifyUser, verifyRoleAndPermission("Fixed", "create"), async (req, res) => {
  const { fixedIds } = req.body;

  try {
    const updatedFixedAssets = await generateFixedAndInvNo(fixedIds); // Correct function call
    res.status(200).json({ msg: "FixedNo and InvNo generated successfully", fixedAssets: updatedFixedAssets });
  } catch (error) {
    console.error("Error generating FixedNo and InvNo:", error);
    res.status(500).json({ msg: error.message });
  }
});

router.get("/fixed", verifyUser, verifyRoleAndPermission("Fixed", "read"), FixedController.getAllFixed);
router.get("/fixed/:id", verifyUser, verifyRoleAndPermission("Fixed", "read"), FixedController.getFixedById);
router.get("/fixedNo/:fixedNo", verifyUser, verifyRoleAndPermission("Fixed", "read"), FixedController.getFixedByFixedNo);
router.put("/fixed/:id", verifyUser, verifyRoleAndPermission("Fixed", "update"), FixedController.updateFixed);
router.delete("/fixed/:id", verifyUser, verifyRoleAndPermission("Fixed", "delete"), FixedController.deleteFixed);
router.delete("/fixedDoc/:id", verifyUser, verifyRoleAndPermission("Fixed", "delete"), FixedController.deleteFixed);

export default router;

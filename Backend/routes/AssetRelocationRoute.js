import { Router } from "@feathersjs/express";
import { AssetRelocationController } from "../controllers/AssetRelocation.js";
import { AssetRelocationItemController } from "../controllers/AssetRelocationItem.js";
import { verifyRoleAndPermission, verifyUser } from "../middleware/AuthUser.js";

const router = Router();
router.post("/asset-relocation", verifyUser, verifyRoleAndPermission("AssetRelocation", "create"), AssetRelocationController.createAssetRelocationWithItems);
router.get("/asset-relocation", verifyUser, verifyRoleAndPermission("AssetRelocation", "read"), AssetRelocationController.getAllAssetRelocations);
router.get("/asset-relocation/:id", verifyUser, verifyRoleAndPermission("AssetRelocation", "read"), AssetRelocationController.getAssetRelocationById);
router.put("/asset-relocation/:id", verifyUser, verifyRoleAndPermission("AssetRelocation", "update"), AssetRelocationController.updateAssetRelocation);
router.delete("/asset-relocation/:id", verifyUser, verifyRoleAndPermission("FixAssetRelocationed", "delete"), AssetRelocationController.deleteAssetRelocation);

router.post("/asset-relocation-item", verifyUser, verifyRoleAndPermission("AssetRelocationItem", "create"), AssetRelocationItemController.createAssetRelocationItem);
router.get("/asset-relocation-item", verifyUser, verifyRoleAndPermission("AssetRelocationItem", "read"), AssetRelocationItemController.getAllAssetRelocationItems);
router.put("/asset-relocation-item/:id", verifyUser, verifyRoleAndPermission("AssetRelocationItem", "update"), AssetRelocationItemController.updateAssetRelocationItem);
router.get("/asset-relocation-item/:id", verifyUser, verifyRoleAndPermission("AssetRelocationItem", "read"), AssetRelocationItemController.getAllAssetRelocationItems);
router.get("/asset-relocation-item/fixed/:fixedIDNo", verifyUser, verifyRoleAndPermission("AssetRelocationItem", "read"), AssetRelocationItemController.getAssetRelocationItemsByFixedIDNo);
router.delete("/asset-relocation-item/:id", verifyUser, verifyRoleAndPermission("AssetRelocationItem", "delete"), AssetRelocationItemController.deleteAssetRelocationItem);

export default router;

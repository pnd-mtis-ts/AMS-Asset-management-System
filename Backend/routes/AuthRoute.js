import { Router } from "@feathersjs/express";
import { Login, logOut, Me } from "../controllers/Auth.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = Router();

router.get("/me", verifyUser, Me);
router.post("/login", Login);
router.delete("/logout", logOut);

export default router;

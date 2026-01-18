import express from "express";
import { register, login, logout, refreshToken, getUserDetails } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/user-details", protect, getUserDetails);

export default router;

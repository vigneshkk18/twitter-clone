import express from "express";

import { protectRoute } from "../middlewares/protectRoute";
import { getMe, login, logout, signup } from "../controllers/auth.controller";

const router = express.Router();

router.get("/me", protectRoute, getMe);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;

import express from "express";

import {
  getUserProfile,
  followUnFollowUser,
  updateUserProfile,
  getSuggestedUsers,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/profile/:username", getUserProfile);
router.get("/suggested", getSuggestedUsers);
router.post("/follow/:id", followUnFollowUser);
router.post("/update", updateUserProfile);

export default router;

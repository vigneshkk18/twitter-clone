import express from "express";

import {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
} from "../controllers/post.controller";

const router = express.Router();

router.get("/all", getAllPosts);
router.get("/following", getFollowingPosts);
router.get("/likes/:userId", getLikedPosts);
router.get("/user/:username", getUserPosts);
router.post("/create", createPost);
router.post("/:id/like", likeUnlikePost);
router.post("/:id/comment", commentOnPost);
router.delete("/:id", deletePost);

export default router;

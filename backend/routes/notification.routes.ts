import express from "express";
import {
  getNotifications,
  deleteNotifications,
} from "../controllers/notification.controller";

const router = express.Router();

router.route("/").get(getNotifications).delete(deleteNotifications);

export default router;

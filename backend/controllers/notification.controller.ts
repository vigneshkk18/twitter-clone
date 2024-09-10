import { RequestHandler } from "express";
import Notification from "../models/notification.model";
import { StatusCodes } from "http-status-codes";

export const getNotifications: RequestHandler = async (req, res) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ to: userId }).populate({
    path: "from",
    select: "username profileImg",
  });

  await Notification.updateMany(
    {
      to: userId,
    },
    {
      read: true,
    }
  );

  res.status(StatusCodes.OK).json(notifications);
};

export const deleteNotifications: RequestHandler = async (req, res) => {
  const userId = req.user._id;

  await Notification.deleteMany({
    to: userId,
  });

  res.status(StatusCodes.OK).json({ message: "Notifications deleted." });
};

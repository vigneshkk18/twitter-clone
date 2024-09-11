import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";

import User from "../models/user.model";
import Notification from "../models/notification.model";

import { BadRequestError, NotFoundError } from "../errors";

export const getUserProfile = async (req: Request, res: Response) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select("-password");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.status(StatusCodes.OK).json(user);
};

export const getSuggestedUsers = async (req: Request, res: Response) => {
  const userId = req.user._id;

  const usersFollowedByMe = await User.findById(userId).select("following");

  const users = await User.aggregate([
    {
      $match: {
        _id: { $ne: userId },
      },
    },
    {
      $sample: { size: 10 },
    },
  ]);

  const filteredUsers = users.filter(
    (user) => !usersFollowedByMe?.following.includes(user._id)
  );
  const suggestedUsers = filteredUsers
    .slice(0, 4)
    .map(({ password, ...user }) => ({ ...user }));

  res.status(StatusCodes.OK).json(suggestedUsers);
};

export const followUnFollowUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const userToModify = await User.findById(id);
  const currentUser = await User.findById(req.user._id);

  if (id === req.user._id.toString())
    throw new BadRequestError("Oops, You cannot follow yourself.");

  if (!userToModify || !currentUser) throw new NotFoundError("User not found");

  const isFollowing = currentUser.following.includes(
    id as unknown as Types.ObjectId
  );

  if (isFollowing) {
    await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
    await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
    res
      .status(StatusCodes.OK)
      .json({ message: "User unfollowed successfully" });
  } else {
    await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
    await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

    await Notification.create({
      type: "follow",
      from: req.user._id,
      to: userToModify._id,
    });

    res.status(StatusCodes.OK).json({ message: "User followed successfully" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
    throw new BadRequestError(
      "Please provide both current password and new password"
    );
  }

  if (currentPassword && newPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) throw new BadRequestError("Current password is incorrect");

    user.password = currentPassword;
  }

  if (profileImg) {
    if (user.profileImg) {
      const id = user.profileImg.split("/").pop()?.split(".")[0]!;
      await cloudinary.uploader.destroy(id);
    }

    const uploadedResponse = await cloudinary.uploader.upload(profileImg);
    profileImg = uploadedResponse.secure_url;
  }

  if (coverImg) {
    if (user.coverImg) {
      const id = user.coverImg.split("/").pop()?.split(".")[0]!;
      await cloudinary.uploader.destroy(id);
    }

    const uploadedResponse = await cloudinary.uploader.upload(coverImg);
    coverImg = uploadedResponse.secure_url;
  }

  user.fullName = fullName || user.fullName;
  user.email = email || user.email;
  user.username = username || user.username;
  user.bio = bio || user.bio;
  user.link = link || user.link;
  user.profileImg = profileImg || user.profileImg;
  user.coverImg = coverImg || user.coverImg;
  const updatedUser = await user.save();

  // @ts-ignore
  updatedUser.password = undefined;

  return res.status(StatusCodes.OK).json(updatedUser);
};

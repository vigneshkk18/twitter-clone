import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import User from "../models/user.model";

import { UnauthenticatedError, BadRequestError } from "../errors";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken";

export const signup = async (req: Request, res: Response) => {
  const user = await User.create(req.body);
  generateTokenAndSetCookie(user._id, res);

  res.status(StatusCodes.CREATED).json({
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    followers: user.followers,
    profileImg: user.profileImg,
    coverImg: user.coverImg,
  });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  const isPasswordCorrect = await user?.comparePassword(password);

  if (!user || !isPasswordCorrect) {
    throw new BadRequestError("Invalid Credentials.");
  }

  generateTokenAndSetCookie(user._id, res);

  res.status(StatusCodes.OK).json({
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    followers: user.followers,
    profileImg: user.profileImg,
    coverImg: user.coverImg,
  });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
};

export const getMe = async (req: Request, res: Response) => {
  if (!req.user)
    throw new UnauthenticatedError("Unauthorized: Please login to continue.");

  const user = await User.findById(req.user._id).select("-password");

  res.status(StatusCodes.OK).json(user);
};

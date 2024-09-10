import { Request, Response } from "express";

import User from "../models/user.model";

import { generateTokenAndSetCookie } from "../lib/utils/generateToken";
import BadRequest from "../errors/bad-request";
import { StatusCodes } from "http-status-codes";

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
    throw new BadRequest("Invalid Credentials.");
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
  res.json({
    data: "You hit the logout endpoint.",
  });
};

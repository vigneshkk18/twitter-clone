import { Request, Response } from "express";

import User from "../models/user.model";

import { generateTokenAndSetCookie } from "../lib/utils/generateToken";

export const signup = async (req: Request, res: Response) => {
  const user = await User.create(req.body);
  generateTokenAndSetCookie(user._id, res);

  res.status(201).json({
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
  res.json({
    data: "You hit the login endpoint.",
  });
};

export const logout = async (req: Request, res: Response) => {
  res.json({
    data: "You hit the logout endpoint.",
  });
};

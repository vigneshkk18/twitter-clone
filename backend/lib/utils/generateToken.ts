import jwt from "jsonwebtoken";
import { Response } from "express";

const _15DAYSINMS = 15 * 24 * 60 * 60 * 1000;

export const generateTokenAndSetCookie = (userId: any, res: Response) => {
  if (!process.env.JWT_SECRET) throw new Error("Jwt Secret not found...");
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: _15DAYSINMS,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

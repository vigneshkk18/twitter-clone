import jwt from "jsonwebtoken";
import { Schema } from "mongoose";
import { RequestHandler } from "express";

import User from "../models/user.model";

import { UnauthenticatedError, NotFoundError } from "../errors";

type VerifyResponse =
  | false
  | {
      userId: Schema.Types.ObjectId;
    };

export const protectRoute: RequestHandler = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) throw new UnauthenticatedError("Unauthorized: No Token Provided");
  if (!process.env.JWT_SECRET) throw new Error("Jwt Secret not found...");

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as VerifyResponse;

  if (!decoded) {
    throw new UnauthenticatedError("Unauthorized: Invalid Token");
  }

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) throw new NotFoundError("User not found");

  req.user = user;
  next();
};

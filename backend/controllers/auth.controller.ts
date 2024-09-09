import { IRouter, Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
  res.json({
    data: "You hit the sign up endpoint.",
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

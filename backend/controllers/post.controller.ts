import { RequestHandler } from "express";
import { v2 as cloudinary } from "cloudinary";
import { StatusCodes } from "http-status-codes";

import User from "../models/user.model";
import Post from "../models/post.model";

import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors";
import Notification from "../models/notification.model";

export const createPost: RequestHandler = async (req, res, next) => {
  const { text } = req.body;
  let { img } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  if (!text && !img) throw new BadRequestError("Post must have text or image");

  if (img) {
    const uploadedResponse = await cloudinary.uploader.upload(img);
    img = uploadedResponse.secure_url;
  }

  const post = await Post.create({
    user: user._id,
    text,
    img,
  });

  res.status(StatusCodes.CREATED).json(post);
};

export const deletePost: RequestHandler = async (req, res, next) => {
  const userId = req.user._id;

  const post = await Post.findById(req.params.id);

  if (!post) throw new NotFoundError("Post not found");

  if (post.user.toString() != userId.toString()) {
    throw new UnauthenticatedError(
      "You are not authorized to delete this post"
    );
  }

  if (post.img) {
    const id = post.img.split("/").pop()?.split(".")[0]!;
    await cloudinary.uploader.destroy(id);
  }

  await Post.findByIdAndDelete(post._id);
  res.status(StatusCodes.OK).json({ message: "Post deleted successfully" });
};

export const commentOnPost: RequestHandler = async (req, res, next) => {
  const { text } = req.body;
  const postId = req.params.id;
  const userId = req.user._id;

  if (!text) throw new BadRequestError("Text is required");

  const post = await Post.findById(postId);

  if (!post) throw new NotFoundError("Post not found");

  post.comments.push({ text, user: userId });

  await post.save();

  res.status(StatusCodes.OK).json(post);
};

export const likeUnlikePost: RequestHandler = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) throw new NotFoundError("Post not found");

  const userLikedPost = post.likes.includes(userId);
  if (userLikedPost) {
    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
    await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
    res.status(StatusCodes.OK).json({ message: "Post unliked successfully" });
  } else {
    post.likes.push(userId);
    await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
    await post.save();

    await Notification.create({
      type: "like",
      from: userId,
      to: post.user,
    });

    res.status(StatusCodes.OK).json({ message: "Post liked successfully" });
  }
};

export const getAllPosts: RequestHandler = async (req, res, next) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "user",
      select: { username: 1, profileImg: 1, fullName: 1 },
    })
    .populate({
      path: "comments.user",
      select: { username: 1, profileImg: 1, fullName: 1 },
    });

  res.status(StatusCodes.OK).send(posts);
};

export const getLikedPosts: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  if (!user) throw new NotFoundError("User not found");

  const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
    .populate({
      path: "user",
      select: { username: 1, profileImg: 1, fullName: 1 },
    })
    .populate({
      path: "comments.user",
      select: { username: 1, profileImg: 1, fullName: 1 },
    });

  res.status(StatusCodes.OK).json(likedPosts);
};

export const getFollowingPosts: RequestHandler = async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) throw new NotFoundError("User not found");

  const following = user.following;

  const followingPosts = await Post.find({ user: { $in: following } })
    .sort({ createdAt: -1 })
    .populate({
      path: "user",
      select: { username: 1, profileImg: 1, fullName: 1 },
    })
    .populate({
      path: "comments.user",
      select: { username: 1, profileImg: 1, fullName: 1 },
    });

  res.status(StatusCodes.OK).json(followingPosts);
};

export const getUserPosts: RequestHandler = async (req, res, next) => {
  const username = req.params.username;

  const user = await User.findOne({ username });

  if (!user) throw new NotFoundError("User not found");

  const posts = await Post.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate({
      path: "user",
      select: { username: 1, profileImg: 1, fullName: 1 },
    })
    .populate({
      path: "comments.user",
      select: { username: 1, profileImg: 1, fullName: 1 },
    });

  res.status(StatusCodes.OK).json(posts);
};

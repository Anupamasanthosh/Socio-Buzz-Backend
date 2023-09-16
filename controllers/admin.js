const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../modals/userModal");
const Post = require("../modals/postModal");
const ReportPost = require("../modals/reportPostModal");


module.exports = {
  adminLogin: async (req, res) => {
    try {
      let adminEmail = "admin@gmail.com";
      let adminPassword = "admin123";
      if (!req.body.email && !req.body.password) {
        return res.status(500).json({ message: "Fill The necessary fileds" });
      }
      if (req.body.email === adminEmail) {
        if (req.body.password === adminPassword) {
          const token = jwt.sign(
            { email: adminEmail, password: adminPassword },
            "mytoken"
          );
          // console.log(token, "tokrnnnn");
          return res.status(200).json({ message: "Admin Login", token });
        } else {
          return res.status(403).json({ message: "password doesnt match" });
        }
      } else {
        return res.status(500).json({ message: "Email doesnt match" });
      }
    } catch (err) {
      return res.status(500).json({ message: "something went wrong", err });
    }
  },
  verifyToken: async (req, res, next) => {
    try {
      const Token = req.body.Token;
      const decoded = jwt.verify(Token, "mytoken");
      if (
        decoded.email === "admin@gmail.com" &&
        decoded.password === "admin123"
      ) {
        return res.status(200).json({ message: "Token valid" });
        next();
      } else {
        res.json({ status: "error", error: "Admin not exist" });
      }
    } catch {
      res.json({ status: "error", error: "Invalid token" });
    }
  },
  userData: async (req, res) => {
    try {
      const users = await User.find();
      res.json({ status: "true", users });
    } catch {
      res.json({ status: "error", error: "Data not available" });
    }
  },
  userBlock: async (req, res) => {
    // console.log(req.body);
    try {
      let id = req.body.id;
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $set: { blocked: true },
        },
        { new: true }
      );

      // console.log(updatedUser, "-------updatedpost");
      res.json({ status: "true" ,updatedUser});
    } catch (err) {
      res.json({ status: "false" });
    }
  },
  userUnBlock: async (req, res) => {
    // console.log(req.body);
    try {
      let id = req.body.id;
      const updatedUser = await User.findByIdAndUpdate(id, {
        blocked: false,
      });

      // console.log(updatedUser, "-------updatedpost");
      res.json({ status: "true" ,updatedUser});
    } catch (err) {
      res.json({ status: "false" });
    }
  },
  allPost: async (req, res) => {
    try {
      const posts = await Post.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
      ]);

      if (posts.length > 0) {
        const users = posts.map((post) => post.user);
        res.json({ status: "true", posts, users });
      } else {
        res.json({ error: "true" });
      }
    } catch {
      res.json({ error: "true" });
    }
  },
  postReport: async (req, res) => {
    // console.log(req.body);
    try {
      let id = req.body.id;
      // console.log(id)
      Post.findByIdAndUpdate(id, { reported: true }, { new: true }).then(()=>
      {

        ReportPost.findOneAndUpdate({postId:id},{adminReported:true},{new:true}).then((updatedPost)=>
        {

          if (updatedPost) {
          
          // console.log("Post updated:", updatedPost);
          res.json({ status: "true" });
          } else {
         
          // console.log("Post not found");
          }
        })
        
      })
    
  
    } catch (err) {
      res.json({ error: "true" });
    }
  },
  allReportedPost: async (req, res) => {
    try {
      const report=await ReportPost.find()
      // console.log(report)
      const reportedPosts = await ReportPost.find()
      .populate({
        path: "postId",
        select: "image caption user createdAt",
        model: Post,
        populate: {
          path: "user",
          select: "userName image",
          model: User,
        },
      })
        .populate({
          path: 'reporters',
          populate: {
            path: 'userId',
            select: 'userName image',
            model: User,
          },
        })
        .exec();
        res.json({ status: "true" ,reportedPosts});
        
    } catch (err) {
      res.status(500).json(err);
      // console.log(err)
    }
  },
};

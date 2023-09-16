const express = require("express");
const User = require("../modals/userModal");
const Post = require("../modals/postModal");
const Following = require("../modals/followingModal");
const Liked = require("../modals/likeModal");
const Follower = require("../modals/followerModal");
const Messages = require("../modals/messageModal");
const Saved = require("../modals/savedCollection");
const Comments = require('../modals/commentModal')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ReportPost = require("../modals/reportPostModal");
const { default: mongoose } = require("mongoose");

module.exports = {
  userSignup: async (req, res) => {
    try {
      if (
        req.body.userName &&
        req.body.userEmail &&
        req.body.password &&
        req.body.cPassword
      ) {
        const userEmail = await User.findOne({ userEmail: req.body.userEmail });
        if (!userEmail) {
          if (req.body.password === req.body.cPassword) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const user = await User.create(req.body);
            res.json({ status: "ok" });
          } else {
            res.json({ status: "error", error: "Password Doesnt Match" });
          }
        } else {
          res.json({ status: "error", error: "Email Already Used" });
        }
      } else {
        res.json({ status: "error", error: "All fields are required" });
      }
    } catch (err) {
      res.json({ status: "error", error: "Some other", err });
    }
  },
  userLogin: async (req, res) => {
    try {
      if (req.body.email && req.body.password) {
        const user = await User.findOne({ userEmail: req.body.email });
        if (user) {
          {
            if (user.blocked) {
              return res.status(403).json({ message: "Blocked By Admin" });
            } else {
              const validPass = await bcrypt.compare(
                req.body.password,
                user.password
              );
              if (validPass) {
                const token = jwt.sign(
                  {
                    userName: user.userName,
                    email: user.userEmail,
                    id: user._id,
                  },
                  "mytoken"
                );

                return res.status(200).json({
                  message: "Login successfull",
                  token,
                  user: user.userName,
                });
              } else {
                return res
                  .status(403)
                  .json({ message: "password doesnt match" });
              }
            }
          }
        } else {
          return res.status(500).json({ message: "user not found" });
        }
      } else {
        return res.status(500).json({ message: "Fill Required fields...!" });
      }
    } catch {
      return res.status(500).json({ message: "something went wrong" });
    }
  },
  verifyToken: async (req, res, next) => {
    try {
      const Token = req.body.Token;

      const decoded = jwt.verify(Token, "mytoken");
      const user = await User.findById(decoded.id);

      if (user) {
        if (user.image) {
          user.image = user.image;
        } else {
          user.image =
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
        }
        return res.status(200).json({ message: "Token valid", user });
        next();
      } else {
        res.json({ status: "error", error: "user not found" });
      }
    } catch (error) {
      res.json({ status: "error", error: "invalid token" });
    }
  },

  imageUpload: async (req, res) => {
    try {
      
      if (req.file) {
        let filePath = req.file.path;
        let Token = req.body.token;
        const decoded = jwt.verify(Token, "mytoken");
        User.findByIdAndUpdate(decoded.id, { image: filePath }, { new: true })
          .then((updatedUser) => {})
          .catch((err) => {});
        return res
          .status(200)
          .json({ message: "Image uploaded successfully", data: filePath });
      }
    } catch {
      return res.status(500).json({ message: "something went wrong" });
    }
  },
  userCoverUpload: async (req, res) => {
    try {
      // console.log(req.body);
      // console.log(req.file);
      if (req.file) {
        let filePath = req.file.path;
        let Token = req.body.token;
        const decoded = jwt.verify(Token, "mytoken");
        User.findByIdAndUpdate(
          decoded.id,
          { coverImage: filePath },
          { new: true }
        )
          .then((updatedUser) => {
            // console.log(updatedUser);
          })
          .catch((err) => {
            // console.log(err);
          });
        return res
          .status(200)
          .json({ message: "Image uploaded successfully", data: filePath });
      }
    } catch {
      return res.status(500).json({ message: "something went wrong" });
    }
  },
  userPostCreation: async (req, res) => {
    try {
      let token = req.body.token;
      let tok = jwt.verify(token, "mytoken");
      // console.log("hello", req.body);
      // console.log(req.file);
      if (req.file) {
        // console.log("jiii");
        const postData = {
          user: tok.id,
          image: req.file.path,
          caption: req.body.caption,
          createdAt: req.body.Date,
        };
        const post = await Post.create(postData);
        // console.log(post);
        if (post) {
          res.json({ status: "post Created" });
        } else {
          res.json({ error: "Upload Image" });
        }
      }
    } catch (err) {
      res.json({ error: "something went wrong" });
    }
  },
  postVideoCreation: async (req, res) => {
    // console.log("patti");
    try {
      // console.log("jii");
      // console.log(req.body, "hi");
      // console.log(req.file, "file");
    } catch {}
  },
  postView: async (req, res) => {
    try {
      const decoded = jwt.verify(req.query.token, "mytoken");
      const posts = await Post.find({ user: decoded.id });
      const user = await User.findById(decoded.id);
      res.json({ status: "true", posts, user });
    } catch {
      res.json({ status: "error" });
    }
  },
  editUser: async (req, res) => {
    try {
      const Token = req.body.token;
      const decoded = jwt.verify(Token, "mytoken");
      const user = await User.findById(decoded.id);
      if (user) {
        if (req.body.name && req.body.bio && req.body.gender) {
          User.findByIdAndUpdate(
            decoded.id,
            {
              userName: req.body.name,
              bio: req.body.bio,
              gender: req.body.gender,
            },
            { new: true }
          )
            .then((updatedUser) => {
              return res
                .status(200)
                .json({ message: "User Updated Successfully" });
            })
            .catch((err) => {
              return res.status(500).json({ error: "Something went wrong" });
            });
        } else {
          if (req.body.email && req.body.email === user.userEmail) {
            User.findByIdAndUpdate(
              decoded.id,
              {
                userEmail: req.body.email,
                phone: req.body.phone,
                dob: req.body.dob,
              },
              { new: true }
            )
              .then((updatedUser) => {
                return res
                  .status(200)
                  .json({ message: "User Updated Successfully" });
              })
              .catch((err) => {
                return res.status(500).json({ error: "Something went wrong" });
              });
          }
        }
        user.save();
      }
    } catch {}
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      const decoded = jwt.verify(req.query.token, "mytoken");
      const filteredUsers = users.filter((user) => user.id !== decoded.id);
      res.json({ status: "true", filteredUsers });
    } catch {
      res.json({ status: "error", error: "Data not available" });
    }
  },
  userFollow: async (req, res) => {
    try {
      const decoded = jwt.verify(req.body.token, "mytoken");
      const user = await User.findById(decoded.id);

      Following.findOneAndUpdate(
        { user: user._id },
        {
          $addToSet: { following: req.body.id },
        },
        { new: true, upsert: true }
      ).exec();
      Follower.findOneAndUpdate(
        { user: req.body.id },
        {
          $addToSet: { follower: user._id },
        },
        { new: true, upsert: true }
      ).exec();
      await User.findByIdAndUpdate(req.body.id, { $inc: { followerCount: 1 } });
      await User.findByIdAndUpdate(decoded.id, { $inc: { followingCount: 1 } });
      res.json({ status: "true" });
    } catch {
      res.json({ error: "true" });
    }
  },
  userFollowing: async (req, res) => {
    try {
      const decoded = jwt.verify(req.query.token, "mytoken");
      const following = await Following.findOne({ user: decoded.id });
      if (following) {
        const followingUsers = [];
        for (const userId of following.following) {
          const user = await User.findOne({ _id: userId });
          if (user) {
            followingUsers.push(user);
          }
        }
        const follower = await Follower.findOne({ user: decoded.id });
        let followerUsers = [];
        if (follower) {
          const followerUserIds = follower.follower;
          followerUsers = await User.find({ _id: { $in: followerUserIds } });
        }
        res.json({ status: "true", followerUsers, followingUsers });
      } else {
        res.json({ error: "true" });
      }
    } catch {
      res.json({ error: "true" });
    }
  },
  followingDetails: async (req, res) => {
    try {
      if (req.query.id) {
        const user = await User.findById(req.query.id);
        if (user) {
          const Follow = await Following.findOne({ user: req.query.id })
            .select("following")
            .exec();

          let followingUserIds = [];
          if (Follow) {
            followingUserIds = Follow.following;
          }
          const followingUsers = await User.find({
            _id: { $in: followingUserIds },
          });
          const followers = await Follower.find({ follower: req.query.id });

          const userIds = followers.map((follower) => follower.user);
          const followerUsers = await User.find({ _id: { $in: userIds } });
          const Posts = await Post.find({ user: req.query.id });
          res.json({
            status: true,
            followerUsers,
            followingUsers,
            Posts,
            user,
          });
        }
      } else {
        res.json({ error: "true" });
      }
    } catch {
      res.json({ error: "true" });
    }
  },
  allPost: async (req, res) => {
    try {
      const decoded = jwt.verify(req.query.token, "mytoken");
      let userPosts = await Post.findOne({ user: decoded.id })
      .sort({ createdAt: -1 }) 
      .populate("user");
      let posts = [userPosts];
      // console.log(posts)
      const following = await Following.findOne({ user: decoded.id });
      if (following) {
        const followingPosts = await Post.find({
          user: { $in: following.following },
        }).populate("user");

        if (followingPosts) {
          posts = [userPosts, ...followingPosts].filter(Boolean);
        }
      }

      // console.log(posts, "postss");
      const postIds = posts.map((post) => post._id);
      // console.log(postIds, "postids");
      const likes = await Liked.find({ post: { $in: postIds } }).populate(
        "user"
      );
      // console.log(likes, "likessss");
      function addLikesToPosts(posts, likes) {
        return posts.map((post) => {
          if (post.reported !== true) {
            const postLikes = likes.filter(
              (like) => like.post.toString() === post._id.toString()
            );
            return { ...post._doc, likes: postLikes };
          }
          return null; // Exclude the post with reported = true
        }).filter(Boolean); // Filter out null values
      }
      
      const postsWithLikes = addLikesToPosts(posts, likes);

      if (postsWithLikes.length > 0) {
        res.json({ status: "true", postsWithLikes });
      } else {
        res.json({ error: "true" });
      }
    } catch (err) {
      // console.log(err);
      res.json({ error: "true" });
    }
  },
  reportPost: async (req, res) => {
    try {
      const data = {
        postId: req.body.id,
        reporters: [
          {
            userId: req.body.user,
            reason: req.body.reason,
          },
        ],
      };
      console.log(data,'jii')
      console.log('kiii')
      const reportedPost = await ReportPost.findOne({ postId: req.body.id });
      if (reportedPost) {
        const reportExist = reportedPost.reporters.some((reporter) =>
          reporter.userId.equals(req.body.user)
        );
        if (reportExist) {
          res.json({ message: "Report already exists", alreadyReported: true });
        } else {
          reportedPost.reporters.push({
            userId: req.body.user,
            reason: req.body.reason,
          });
          const updatedReport = await reportedPost.save();
          res
            .status(200)
            .json({ message: "report updated Successfull", updatedReport });
        }
      } else {
        const report = await ReportPost.create(data);
        if (report) {
          res
            .status(200)
            .json({ message: "report created Successfull", report });
        }
      }
    } catch (err) {
      res.json({ status: "false" ,err});
    }
  },
  likePost: async (req, res) => {
    try {
      // console.log("jii");
      // console.log(req.body);
      const decoded = jwt.verify(req.body.token, "mytoken");
      const userId = decoded.id;
      Liked.findOne({ post: req.body.post })
        .then((existLike) => {
          if (existLike) {
            if (!existLike.user.includes(decoded.id)) {
              existLike.user.push(decoded.id);
              existLike.likeCount += 1;
            }
            res
              .status(200)
              .json({ message: "Like added successfully", existLike });
            return existLike.save();
          } else {
            const newLike = new Liked({
              user: [decoded.id],
              post: req.body.post,
              likeCount: 1,
            });
            res.status(200).json({ message: "like added", newLike });
            return newLike.save();
          }
        })
        .catch(() => {
          res.status(400).json({ error: "Error" });
        });
    } catch {
      res.status(400).json({ error: "Error" });
    }
  },
  unlikePosts: async (req, res) => {
    try {
      // console.log(req.body, "req.body");
      const decoded = jwt.verify(req.body.token, "mytoken");
      Liked.findOne({ post: req.body.post })
        .then((likeExist) => {
          // console.log(likeExist, "exist like");
          if (likeExist) {
            if (likeExist.user.includes(decoded.id)) {
              likeExist.user.pull(decoded.id);
              likeExist.save();
              res
                .status(200)
                .json({ message: "User removed successfully", likeExist });
            } else {
              res.status(400).json({ error: "Post is not liked by the user" });
            }
          } else {
            res.status(400).json({ error: "Error" });
          }
        })
        .catch(() => {
          // console.log("di");
          res.status(400).json({ error: "Error" });
        })
        .catch(() => {
          // console.log("di");
          res.status(400).json({ error: "Error" });
        });
    } catch {
      res.status(400).json({ error: "Error" });
    }
  },
  findUser: async (req, res) => {},
  savePost: async (req, res) => {
    try {
      const saved = await Saved.findOne({ user: req.body.userid });
      if (saved) {
        if (saved.postId.includes(req.body.postId)) {
          return res
            .status(400)
            .json({ message: "Post already saved!", saved });
        }
        if (mongoose.Types.ObjectId.isValid(req.body.postId)) {
          saved.postId.push(req.body.postId);
          await saved.save();
          res.status(200).json({ message: "Post saved successfully!", saved });
        } else {
          res.status(400).json({ message: "Invalid postId!", saved });
        }
      } else {
        const newSaved = new Saved({
          user: req.body.userid,
          postId: req.body.postId, // Assuming req.body.postId is a single postId
        });
        await newSaved.save();
        return res
          .status(200)
          .json({ message: "New document created with Post ID", saved });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  saved: async (req, res) => {
    try {
      const decoded = jwt.verify(req.query.user, "mytoken");
      const saved = await Saved.findOne({ user: decoded.id }).populate({
        path: "postId",
        populate: {
          path: "user",
          select: "userName userEmail image",
        },
      });
      res.json({ status: "true", saved });
    } catch {
      res.json({ error: "true" });
    }
  },
  unsave: async (req, res) => {
    const { postId, userId } = req.body;
    Saved.findOneAndUpdate(
      { user: userId },
      {
        $pull: { postId: postId },
      },
      { new: true }
    )
      .then((res) => {
        // console.log(res);
        res.json({ status: "true", res });
      })
      .catch((err) => {
        res.json({ error: "true", err });
      });
  },
  unFollow: async (req, res) => {
    try {
      const decoded = jwt.verify(req.query.token, "mytoken");
      Following.findOne({ user: decoded.id }).then((following) => {
        following.following.pull(req.query.id);
        return following.save();
      });
      Follower.findOne({ user: req.query.id }).then((follower) => {
        follower.follower.pull(decoded.id);
        return follower.save();
      });
    } catch {}
  },
  sendMsg: async (req, res) => {
    try {
      // console.log(req.body, "bodyyyy");
      const data = {
        message: { text: req.body.message },
        users: [req.body.from, req.body.to],
        sender: req.body.from,
      };
      // console.log(data);
      const message = await Messages.create(data);
      if (message) {
        return res.status(200).json({ message: "Message saved Successfully" });
      } else {
        return res.status(400).json({ message: "Something wrong" });
      }
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  getAllMsg: async (req, res) => {
    try {
      // console.log(req.query, "from hehe");
      const { from, to } = req.query;
      // console.log(from, to);
      const messages = await Messages.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updatedAt: 1 });
      // console.log(messages, "yo msg");
      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message.text,
        };
      });
     return  res.json(projectedMessages);
    } catch (err) {
      return res.json(err)
    }
  },
  addComment:async (req,res)=>
  {
    try
    {
      console.log(req.body,'from add comment')
    let data={
      user:req.body.id,
      post:req.body.postId,
      comment:req.body.comment
    }
    const comments= await Comments.create(data)
    console.log('c',comments,'-----------------------------')
    if(comments)
    {
      return res.status(200).json({ message: "Comments addedd successfully" ,comments});
    }
    else
    {
      return res.status(500).json({ error: "Problem there" });
    }
  }catch(err){
    console.log(err,'err')
  }
  },
  getComments:async (req,res)=>
  {
    try
    {
      console.log(req.query,'from get cmnts')
      console.log(req.query.post)
      const postId=req.query.post
      if(postId)
      {
        const comments=await Comments.find({post:postId})
        console.log(comments,'comments from backend')
        return res.status(200).json({comments});
      }
      else
      {
        return res.status(400).json({ error: "Comments not seted " });
      }
    }
    catch(err)
    {
      return res.status(500).json({ error:err });
    }
  }
};

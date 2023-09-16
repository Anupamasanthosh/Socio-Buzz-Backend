const mongoose = require('mongoose')
const User=require('./userModal')
const Post=require('./postModal')
const Like = new mongoose.Schema(
	{
		user: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true
          }],
          post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Post,
            required: true
          },
          likeCount:{
            type:Number,
          }
          
	},
	{ collection: 'Like-Data' }
)

const model = mongoose.model('LikeData', Like)

module.exports = model
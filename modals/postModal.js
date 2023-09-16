const mongoose = require('mongoose')
const User=require('./userModal')

const Post = new mongoose.Schema(
	{
		user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true
          },
          image: {
            type: String,
            required: true
          },
          caption: {
            type: String,
            required: true
          },
          createdAt: {
            type: Date,
            default: Date.now
          },
          reported:{
            type:Boolean,
            default:false
          },
          count:{
            type:Number
          },
          likedCount:{
            type:Number
          }
	},
	{ collection: 'Post-Data' }
)

const model = mongoose.model('PostData', Post)

module.exports = model
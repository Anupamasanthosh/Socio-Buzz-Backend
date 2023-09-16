const mongoose = require('mongoose')
const Post =require('./postModal')
const Saved = new mongoose.Schema(
	{
		user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
          },
          postId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: Post,
            required: true
          }],
	},
	{ collection: 'Saved' }
)

const model = mongoose.model('Saved', Saved)

module.exports = model
const mongoose = require('mongoose')
const User =require('./userModal')
const Follower = new mongoose.Schema(
	{
		user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true
          },
          follower: {
            type: Array,
            required: true
          }
	},
	{ collection: 'Follower' }
)

const model = mongoose.model('Follower', Follower)

module.exports = model
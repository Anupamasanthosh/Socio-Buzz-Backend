const mongoose = require('mongoose')
const Following = new mongoose.Schema(
	{
		user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
          },
          following: {
            type: Array,
            required: true
          }
	},
	{ collection: 'Following' }
)

const model = mongoose.model('Following', Following)

module.exports = model
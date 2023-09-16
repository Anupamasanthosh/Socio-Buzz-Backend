const mongoose=require('mongoose')
const reportPostSchema = mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    reporters: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reason: { type: String, required: true },
      }
    ],
    createdAt: { type: Date, default: Date.now },
    adminReported:{type:Boolean}
  },
  {
    timestamps: true,
  },
  
);

const model=mongoose.model('ReportedPost',reportPostSchema)
module.exports=model



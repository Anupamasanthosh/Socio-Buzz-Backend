const mongoose=require('mongoose')

const User=new mongoose.Schema(
    {
        userName:{type:String,required:true},
        userEmail:{type:String,required:true},
        password:{type:String,required:true},
        cPassword:{type:String,required:true},
        image:{type:String},
        coverImage:{type:String},
        bio:{type:String},
        gender:{type:String},
        dob:{type:String},
        phone:{type:String},
        blocked:{type:Boolean},
        followerCount:{type:Number},
        followingCount:{type:Number}
    },{
        collection:'users'
    }
)
const model=mongoose.model('Userdata',User)
module.exports=model
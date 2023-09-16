
const mongoose=require('mongoose')

mongoose.set('strictQuery',true)

const url='mongodb://127.0.0.1:27017/social-media'
mongoose.connect(url).then(()=>
{
    console.log('connected to mongodb')
}).catch((error)=>
{
    console.log(error)
}) 
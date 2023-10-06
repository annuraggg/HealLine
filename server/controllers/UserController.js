const User = require('../models/UserSchema');

const hello = (req,res)=>{
    res.send('Huii');
}

const postUserData = async(req,res)=>{
   console.log(req.body);
   const {name,type,rating,exp,fees,addr,about,Image,Role} = req.body;
   console.log(rating);
   const user = await User({
       name,type,rating,exp,fees,addr,about,Image,Role
   });
    await user.save();
    if(user){
        res.json({status:200,message:'Document Inserted'});
    }else{
        res.json({status:400,message:'Document Not Inserted'});
    }
}

const getUserData = async(req,res)=>{
    const user = await User.find();
    if(user){
        res.json({status:200,data:user});
    }else{
        res.json({status:400,message:'Document Not Found'});
    }
}

module.exports = {hello,postUserData,getUserData};
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name:{
        type:String
    },
    type:{
        type:String,
    },
    rating:{
        type:Number,
    },
    exp:{
        type:Number,
    },
    fees:{
        type:Number,
    },
    addr:{
        type:String,
    },
    about:{
        type:String,
    },
    Image:{
        type:String,
    },
    Role:{
        type:String,
    }
})

module.exports = mongoose.model('Users',UserSchema);
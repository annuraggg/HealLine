const mongoose = require('mongoose');

const conn = async ()=>{
    const isConnected = await mongoose.connect('mongodb://localhost:27017/test')
    if(isConnected){
        console.log('Database connected');
    }else{
        console.log('Database not connected');
    }
} 

module.exports = conn;
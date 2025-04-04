const mongoose = require('mongoose');

const clientProfileSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    phoneNumber:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    city:{
        type:String,
        required:true,
        trim:true
    },
    postalCode:{
        type:String,
        required:true,
        trim:true
    },
})

const ClientProfile = mongoose.model('ClientProfile', clientProfileSchema);
module.exports = ClientProfile;
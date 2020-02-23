const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type: String,
        required: true,
        trim : true
    },
    password : {
        type: String,
        required: true,
        trim : true
    },
    createdPosts : [{
        type: Schema.Types.ObjectId,
        ref : 'Post'
    }]
    },{
        timestamps : true 
    });

 const User = mongoose.model('User' , userSchema)
    
 module.exports = User;



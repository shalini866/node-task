const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,   
        lowercase: true, 
        
    },
    password: {
        type: String,
        required: true,
        minlength: 6,  
       
    },
    token: {
        type: String,
        required: true,
        
    }
});

const Collection = mongoose.model("AuthCollection", Schema);

module.exports = Collection;

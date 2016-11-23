var mongoose = require("mongoose");
var blobSchema = new mongoose.Schema({
    user_name : String,
    first_name : String,
    last_name : String,
    password : String,
    token : String,
    created_user : String,
    created_date : Date,
    updated_user : String,
    updated_date : Date
});
mongoose.model('user', blobSchema);
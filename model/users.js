var mongoose = require("mongoose");
var blobSchema = new mongoose.Schema({
    user_name: String,
    first_name: String,
    last_name: String,
    password: String
});
mongoose.model('user', blobSchema);
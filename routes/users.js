const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/PetrolData")
const plm = require("passport-local-mongoose")

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  
})

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema)
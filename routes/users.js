const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://arpita08:z9SbH9hi8524aVKw@cluster0.quxmdqi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
  console.log("Connected")
}) 

const plm = require("passport-local-mongoose")

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  
})

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema)
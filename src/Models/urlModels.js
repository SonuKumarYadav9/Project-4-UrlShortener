const mongoose = require("mongoose");

const urlModel = new mongoose.Schema({
 
   urlCode: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim:true
   },
   longUrl: {
      type: String,
      required: true,
      unique: true,
   },
   shortUrl: {
      type: String,
      unique: true,
     required: true,
     }
   }, { timestamps: true })

module.exports = mongoose.model('Url', urlModel)
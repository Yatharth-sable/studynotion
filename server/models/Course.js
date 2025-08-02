const mongoose = require("mongoose")
const courseSchema = new mongoose.Schema({
     courseName:{
        type:String,
        trim:true,
        required:true,
     },
	courseDescription: { type: String },

     instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        trim:true,
        required:true
     },
     whatYouWillLearn:{
        type:String,
     },
     courseContent:[
       {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
        }
     ],
      ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
        trim:true,
        requried:true
     }],
      price:{
        type:Number,
        trim:true,
     },
     thumbnail:{
        type:String,
     },
     studentEnrolled:{
        type:mongoose.Schema.Types.ObjectId,
        requried:true,
        ref:"User"
     },
     tag:{
      type:[String],
      required:true

     },
     category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category" // maybe t aayega
     },
     instruction:{
        type:[String]
     },
     status:{
      type:String,
      enum:["Draft",'Published']
     }
     
})
module.exports = mongoose.model("Course",courseSchema)
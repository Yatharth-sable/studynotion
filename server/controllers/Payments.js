
const {instance} = require("../config/razorpay") 
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail")

// capture the payment and intiate the razorpay order
exports.capturePayment = async(req,res)=>{
    // get courseId and userId
    const {course_id} = req.body
    const userId = req.user.id
    // validation
    // valid courseid
      if (course_id){
        return res.status(400).json({
            success:false,
            message:"payments:errors to fetch the courseId"
        })
    }
        // valid courseDetail
        let course; 
        try{
         course = await Course.findById(course_id)
         if(!course){
            return res.status(400).json({
               success:false,
               message:"payments:could not find the course"
            })
         }
         
         // check user already pay for the same course
         // converts id into objectid which was in string . convert bz course me objectid ke isse store kiya h
         const uid= new mongoose.Types.ObjectId(userId);
         if(course.studentEnrolled.includes(uid)){
             return res.status(200).json({
                success:false,
                message:"Student is already Enrolled"
             })
         }
         }
        catch(err){
           console.log(err)
           return res.status(500).json({
             success:false,
             message:err.message
           })
        }

         // Order create    
         const amount = course.price
         const currency = "INR";

         const options = {
            amount : amount*100,
            currency,
            receipt:Math.random(Date.now()).toString(),
            notes:{
                courseId : course_id,
                userId,
            }
         }

         try{
           // initiate the payment using razopay 
           const paymentResponse = await instance.orders.create(options)
           console.log(paymentResponse)

            return res.status(200).json({
                success:true,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:course.paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
             })
         }
          catch(err){
           console.log(err)
           return res.status(500).json({
             success:false,
             message:"could not intiate the order"
           })
          }  
}

// verify the signature of razorpay and server

exports.verifySignature = async(req,res) =>{

   const webhookSecret = "1234567"
   // razorpay se yeh format me secret key aayegi 
   const signature = req.headers("x-razorpay-signature")

   // to convert the webhooksecret  to encryption we use this , sha256 is hashing algo
   const shasum = crypto.createHmac("sha256",webhookSecret);

   // convert it to the string
   shasum.update(JSON.stringify(req.body))
   // digest me likhte hai bs 
   const digest = shasum.digest("hex")

  if (signature === digest){
      console.log("Payment is Authorized")
  
     // now we have to enroll the student into the course
     const {courseId,userId} = req.body.payload.payment.entity.notes
     

     try{
       // fullfill the action

       // find the course and enroll the student 
       const enrolledCourse = await Course.findOneAndUpdate(
                                              {_id:courseId},
                                              {$push:{studentEnrolled:userId}},
                                              {new:true}
       )

       if(!enrolledCourse){
         return res.status(500).json({
            success:false,
            message:"Course Not found"
         })
       }
       console.log(enrolledCourse)
       // find the student and student ke andr course me course_id ko add krdo
        const enrolledStudent = await User.findOneAndUpdate(
                                              {_id:userId},
                                              {$push:{course:courseId}},
                                              {new:true}
       )
       console.log(enrolledStudent)

       // send confimation mail to student to that your course successfully buy
         const emailResponse = await mailSender(
                               enrolledStudent.email,
                               "Email form StudyNotion",
                               "congrats,you are onboared to the course "
         )
       console.log(emailResponse)
       return res.status(200).json({
        success:true,
        message:"Signature Verified and course valided"
       })

     }
     catch(err){
            console.log(err)
           return res.status(500).json({
             success:false,
             message:err.message
           })
     } 
  }

  else{
      return res.status(400).json({
        success:false,
        message:"Failed to do enrolled to course"
      })
  }
}
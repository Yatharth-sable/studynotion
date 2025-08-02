const Course = require("../models/Course")
const User = require("../models/User")
const Category = require("../models/Category")
const {uploadImageToCloudinary} = require("../utils/imageUploader")

// createCourseHandler function
exports.createCourse = async (req,res) => {

    try{
        
        // fetch data 
        const {courseName,courseDescription,whatYouWillLearn,price,category} = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage 
        
        // validation
        if (!courseName || !courseDescription || ! whatYouWillLearn || !price || !category) {
           return res.status(400).json({
                success:false,
                messgae:"All the fields required for the to create Course"
            })
        }

        // check for the instructor
        // auth krte time user me id daal di thi ab usko fetch krke details nikal rhe hai
        const userId = req.user.id
        const instructorDetails = await User.findById(userId);
        console.log("Insturctor Details " ,instructorDetails)
        // verify that userid and InstuctorDetails.id are same  or different?

        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"Instructor Deatils are not found"
            })
        }

        // check given Category is valid or not
        const categoryDetails = await Category.findById(category)

        if(!categoryDetails){
              return res.status(400).json({
                success:false,
                message:"Category details are not found"
            })
        }

        //Upload image to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        // create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_Url,  
        })

         // Add the newcourse to the user schema of Instructor
         await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: { courses: newCourse._id } 
            }, 
            {new:true},
         )
//           await Tags.create({
//   name: courseName,
//   description: courseDescription, 
//   course: courseId // Must be a valid ObjectId from Course model  .. we can create the tag instad of that 
// });

        // Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
		);

// Add the new course to the User Schema of the Instructor
        await User.findByIdAndUpdate(
        {_id: instructorDetails._id},
        {
            $push: { name: courseName,
                    description: courseDescription,
                } 
        }, 
        {new:true},
        )


        // return response
        return res.status(200).json({
            success:true,
            message:"Course Creation successfully",
            newCourse:newCourse
        })

    }
    catch (err){
        console.log(err.message)
         res.status(400).json({
                success:false,
                message:"Error in Course creation"
            })
    }
}

// Get all course Handler function
exports.showAllCourses = async (req ,res) => {
    try{
           const allCourses = await Course.find({} , {courseName:true,
                                                      price:true,
                                                      instructor:true,
                                                     ratingAndReviews:true,
                                                       studentEnrolled:true,})
                                                      .populate("Instructor")
                                                      .exec();
          return res.status(200).json({
            success:true,
            message:"Data for all course are fetch successfully",
            data:allCourses
          })
    }
    catch (err){
        console.log(err)
         res.status(400).json({
                success:false,
                message:"Cannot fetch Course data"
            })
    }
}

// getCourseDetails
exports.getCourseDetails = async(req,res) => {
    try{
            // get id
            const {courseId} = req.body
            // find course Details
            const courseDetails = await Course.findById(
                                            courseId)
                                            .populate(
                                                {
                                                    path:"instructor",
                                                    populate:{
                                                        path:"additonalDetails"
                                                    },
                                                }
                                              )
                                              .populate("category")
                                              .populate("ratingAndReviews")
                                              .populate(
                                                {
                                                    path:"courseContent",
                                                    populate:{
                                                        path:"subSection"
                                                    },
                                                }
                                              )
                                              .exec();
     // validation
     if(!courseDetails) {
         return res.status(400).json({
            success:false,
            message:`Could not find the course with id ${courseId}`
         })
     }
            return res.status(200).json({
            success:true,
            message:` find the details of course with id ${courseId}`,
            courseDetails:courseDetails
         })
    }
    catch(err){
        console.log(err.message)
        return res.status(400).json({
            success:false,
            message:"Course: Failed to fetch the all course details"
         })
    }
}
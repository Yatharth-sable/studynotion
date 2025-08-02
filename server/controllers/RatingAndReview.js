const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

// Create Rating
exports.createRating = async (req, res) => {
  try {
    // fetch the user
    const userId = req.user.id;

    // fetch the data from req body
    const { rating, review, courseId } = req.body;

    //  check user already have the course , 
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentEnrolled: { $elematch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }
    
    // check if already review the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Course is already reviewed by the user",
      });
    }
    // creating the review and rating
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // update course with rating and review
    const updateCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Rating and Review created successfully",
      ratingReview,
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
      messages: "RaingandReview: failed to rate and review",
    });
  }
};

// get avg rating
exports.getAverageRating = async (req, res) => {
  try {
    // get courseId
    const courseId = req.body.courseId;

    //  calculate avg rating
    const result = await RatingAndReview.aggregate([
      { 
        $match: {
          course: new mongoose.Types.ObjectId(courseId), // to converting  id {string to objectid}
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    // return rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    // if no rating/review exist
    return res.status(200).json({
      success: true,
      message: "Average Rating is 0 ,no rating till now ",
      averageRating: 0,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
      messages: "RaingandReview: failed to rate and review",
    });
  }
};

// get all reviews
 
exports.getAllRating = async (req,res) => {
     
     try{
        const allReviews = await RatingAndReview.find({})
                                            .sort({rating:"disc"})
                                            .populate({
                                                path:"user",
                                                select:"firstName lastName email image"
  // select ka use krne selected fields hi populate hoge
                                            })
                                            .populate({
                                                path:"course",
                                                select:"courseName"
                                            })
                                            .exec();

       return res.status(200).json({
         success:true,
         message:"All rating and review are fetched",
         data:allReviews
       })
        
     }
     catch(err){
      console.log(err)
      return res.status(400).json({
         success:false,
         message:"Failed to fetch the data",
      })
     }
}

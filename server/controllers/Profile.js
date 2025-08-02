const Profile = require("../models/Profile")
const User = require("../models/User")
const {auth} = require("../middlewares/auth");
const {uploadImageToCloudinary}  = require("../utils/imageUploader")


exports.updateProfile = async (req,res) => {
    
    try{
        // get the data
        const {dateOfBirth="",about="",contactNumber,gender} = req.body

        // get user Id
        const id = req.user.id

        // validation
        if(!contactNumber || !dateOfBirth || !id){
            return res.status(400).json({
                success:false,
                message:"All fields are requried for Profile"
            })
        }

        // find Profile
        const userDetails = await User.findById(id)
        // user ki id me additonal details use nikalna hai
        const profileId = userDetails.additonalDetails;
        const profileDetails = await Profile.findById(profileId)

        //Update Profile
        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about
        profileDetails.gender = gender
        profileDetails.contactNumber = contactNumber
         await  profileDetails.save();

         // return response
         return res.status(200).json({
                success:true,
                message:"Profile Update successfully",
                profileDetails,
            })
    }
    catch(err){
        console.log(err.message)
       return res.status(400).json({
                success:false,
                message:"Error in Profile Updation"
            })
    }
} 
// search=> how can we schedule this deletion operation
// delete account
exports.deleteAccount = async(req,res) => {
    try{
        // get id
        const id = req.user.id

        // Validation
        const userDetails = await User.findById(id);

        if (!userDetails){
             return res.status(404).json({
                success:false,
                message:"User Not found to delete profile"
            })
        
        }
            // Delete Assosiated Profile with the User
            await Profile.findByIdAndDelete({_id:userDetails.additonalDetails})
            // todo: hw unenroll user form all the enrolled courses
            // delete user
            await User.findByIdAndDelete({_id:id})
             return res.status(200).json({
                success:true,
                message:"User deletion successfully"
            })
    }
    
    catch(err){
        console.log(err.message)
         return res.status(404).json({
                success:false,
                message:"User unsuccessfull to delete profile"
            })
    }
}

exports.getAllUserDetails = async (req, res) => {
	try {
    const id = req.user.id;
    console.log(id) 
		const userDetails = await User.findById(id)
			.populate("additonalDetails")
			.exec();
		console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        messages: "idk",
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
         }
};
const User = require("../models/User");
const Section = require("../models/Section");
const Course = require("../models/Course");

// create the section
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    // check the validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Fill all the fileds for the for validation",
      });
    }
    // create section
    const newSection = await Section.create({ sectionName });

    // Update course with the objct Id
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection.id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Course Section Created successfully",
      updatedCourseDetails: updatedCourseDetails,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      success: false,
      message: "Section creation failed try again later",
    });
  }
};

// Update the section
exports.updateSection = async (req, res) => {
  try {
    //data Input
    const { sectionName, sectionId } = req.body;

    //validate data
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties for Update section",
      });
    }

    //update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    //return res
    return res.status(200).json({
      success: true,
      message: "Sectioin update carefully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Missing properties for Update section",
    });
  }
};

// delete section
exports.deleteSection = async (req, res) => {
  try {
    // get ID - assuming sending ID in params
    const { sectionId } = req.params;

    // check if the section present or not
    const section = await Section.findByid(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found for delete",
      });
    }

    // find by Id and delete
    await Section.findByIdAndDelete(sectionId);
    
    //  Remove the sectionId from Course.courseContent
    await Course.updateOne(
      { courseContent: sectionId },
      { $pull: { courseContent: sectionId } }
    );

    // return res
    res.status(200).json({
      success: true,
      message: "Section Delete successfully",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Missing properties for Delete section",
    });
  }
};

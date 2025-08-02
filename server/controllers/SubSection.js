const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create the subsection

exports.createSubsection = async (req, res) => {
  try {
    // fetch the data from req body
    const { sectionId, title, description } = req.body;

    // extract file/video
    const video = req.files.videoFile;

    // validation
    if (!sectionId || !title  || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All the fields required for the for create subsection",
      });
    }
    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    console.log("sectionId:", sectionId);

    // create a sub-section
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // update section with this sub section objectID
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: SubSectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection");

    // todo hw: log updated section here after adding populate query
    // return response
    return res.status(200).json({
      success: true,
      message: "sub Section Created successfully",
      data: updatedSection,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Sub-section failed to create",
    });
  }
};

// todo update and delete subsection

// update the subsection
exports.updateSubSection = async (req, res) => {
  try {
    // fetch the data
    const {
      subSectionId,
      title = "",
      timeDuration = "",
      description = "",
    } = req.body;
    const video = req.files?.videoFile;

    // verify the secton id that already exists
    const subsection = await SubSection.findById(subSectionId);
    if (!subsection) {
      return res.status(400).json({
        success: false,
        message: "Subsection id not found",
      });
    }

    const updatedData = {
      title,
      timeDuration,
      description,
    };

    // extract file/video
    if (video) {
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      updatedData.video = uploadDetails.secure_url;
    }

    // update the details
    await SubSection.findByIdAndUpdate(subSectionId, updatedData, {
      new: true,
    });

    // res msg
    res.status(200).json({
      success: true,
      message: "Update subsection is done",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Sub-section failed to Update",
    });
  }
};

// delete the subsection
exports.deleteSubSection = async (req, res) => {
  try {
    // find the ID
    const { subSectionId } = req.params;

    if (!subSectionId) {
      return res.status(500).json({
        success: false,
        message: "SubSection delete : fail to fetch the subsectionId",
      });
    }

    // delete the id
    await SubSection.findByIdAndDelete(subSectionId);

    // return res
    res.status(200).json({
      success: true,
      message: "Sub-Section Delete successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Sub-section failed to Update",
    });
  }
};

const express = require("express")
const router = express.Router();
const{getCourseDetails,showAllCourses,createCourse} = require("../controllers/Course")
const{createRating,getAverageRating,getAllRating} = require("../controllers/RatingAndReview")
const{createCategory,showAllCategory,categoryPageDetails} = require("../controllers/Category")

const{deleteSection,updateSection,createSection} = require("../controllers/Section")
const{createSubsection,updateSubSection,deleteSubSection} = require("../controllers/SubSection")

// Middleware
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

// Courses can Only be Created by Instructors
router.post("/createCourse",auth,isInstructor,createCourse)

// add a section to the course
router.post("/addSection", auth, isInstructor, createSection)

// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Update a delete
router.post("/deleteSection/:sectionId", auth, isInstructor, deleteSection)

// Edit subsection
router.post("/createSubSection", auth, isInstructor, createSubsection)
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
router.post("/deleteSubSection/", auth, isInstructor, deleteSubSection)

// get all registed course
router.get("/getAllCourses", showAllCourses)

// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// category only created by the admin
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", auth, isAdmin, showAllCategory);
router.post("/categoryPageDetails", auth, isAdmin, categoryPageDetails);

// ********************************************************************************************************
//                                    Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)


module.exports = router

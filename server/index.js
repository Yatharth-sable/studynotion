const express = require("express")
const app = express();

const userRoutes = require("./routes/User")
const profileRoutes = require("./routes/Profile")
const paymenRoutes = require("./routes/Payment")
const courseRoutes = require("./routes/course")

const {cloudinaryConnect} = require("./config/cloudinary")
const database = require("./config/database")

const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv")
const cors = require("cors");

dotenv.config();
const PORT = process.env.PORT || 3000

// middleware
app.use(express.json())
app.use(cookieParser())

app.use(
    cors({
        origin:"http://localhost:3000",
        credential:true,
    })
)

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/temp"
    })
)

// connection with the database
database.connect();

// connection with the cloudinary
cloudinaryConnect();

// api route mount krna hai 
app.use("/api/v1/auth",userRoutes)
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/course",courseRoutes)
app.use("/api/v1/payment",paymenRoutes)

// activate the server
app.listen( PORT , () => {
  console.log(`app is the running on ${PORT}`)
})

app.get("/",(req,res) => {
  res.send("Server is running ✅" + PORT);
})


import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import connectDB from "./config/dbConfig.js"


//LOCAL IMPORTS
    import authRoutes from "./routes/authRoutes.js"
    import followRoutes from "./routes/followRoutes.js"
    import errorHandler from "./middleWare/errorHandler.js"
    import profileRoutes from "./routes/profileRoutes.js"
    import adminRoutes from "./routes/adminRoutes.js"
    import postRoutes from "./routes/postRoutes.js"
    import savedPostRoutes from "./routes/savedPostRoutes.js"

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

//connect DB
connectDB()

//Body Parser
app.use(express.json())
app.use(express.urlencoded())


//default routes
app.get('/' , (req,res) =>{
    res.json({
        message : "WELCOME TO IMAGINEX API...."
    })
})

//AUTH ROUTES
app.use("/api/auth" , authRoutes)

//FOLLOW ROUTES
app.use("/api/user" , followRoutes)

//PROFILE ROUTES
app.use("/api/profile" , profileRoutes)

//ADMIN ROUTES
app.use("/api/admin" , adminRoutes)

//POST ROUTES
app.use("/api/posts" , postRoutes)

//SAVED POSTS 
app.use("/api/saved-posts" , savedPostRoutes)


//Error Handler
app.use(errorHandler)

app.listen(PORT , () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue)
})
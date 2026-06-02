import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import connectDB from "./config/dbConfig.js"
import path from "path"
import { fileURLToPath } from 'url'

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
//LOCAL IMPORTS
    import authRoutes from "./routes/authRoutes.js"
    import followRoutes from "./routes/followRoutes.js"
    import errorHandler from "./middleWare/errorHandler.js"
    import profileRoutes from "./routes/profileRoutes.js"
    import adminRoutes from "./routes/adminRoutes.js"
    import postRoutes from "./routes/postRoutes.js"
    import savedPostRoutes from "./routes/savedPostRoutes.js"
    import notificationRoutes from "./routes/notificationRoutes.js"
    import creditRequestRoutes from "./routes/creditRequestRoutes.js"

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

//connect DB
connectDB()

//Body Parser
app.use(express.json())
app.use(express.urlencoded())


//default routes
app.get('/api' , (req,res) =>{
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

//NOTIFICATION ROUTES
app.use("/api/notifications" , notificationRoutes)

//CREDIT REQUEST ROUTES
app.use("/api/credits/request" , creditRequestRoutes)


// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../Client/dist')))

    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, '../Client', 'dist', 'index.html'))
    })
}

//Error Handler
app.use(errorHandler)

app.listen(PORT , () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue)
})
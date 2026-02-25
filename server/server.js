import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import connectDB from "./config/dbConfig.js"


//LOCAL IMPORTS
    import authRoutes from "./routes/authRoutes.js"
    import followRoutes from "./routes/followRoutes.js"
import errorHandler from "./middleWare/errorHandler.js"

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
app.use("/api/follow" , followRoutes)



//Error Handler
app.use(errorHandler)

app.listen(PORT , () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue)
})
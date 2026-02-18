import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import connectDB from "./config/dbConfig.js"

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

//connect DB
connectDB()

//default routes
app.get('/' , (req,res) =>{
    res.json({
        message : "WELCOME TO IMAGINEX API...."
    })
})

app.listen(PORT , () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue)
})
const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
var bodyParser = require('body-parser')
const morgan = require('morgan')
const dotenv = require('dotenv')
dotenv.config()
//connect database
mongoose.connect(process.env.MONGODB_URL,()=>{
    console.log("Connected mongodb")
})
app.use(bodyParser.json({limit:"500mb"}))
app.use(cors())
app.use(morgan("common"))
const questionRoute = require("./routes/questionRoute")
app.use("/question",questionRoute)
const courseRoute = require("./routes/courseRoute")
app.use("/course",courseRoute)
const userRoute = require("./routes/userRoute")
app.use("/user",userRoute)
app.get("/",(req,res)=>{
    res.send("Hello World!!")
})
const PORT  = process.env.PORT|| 3000
app.listen(PORT, ()=>{
    console.log(`server is running ... on ${PORT}`)
})
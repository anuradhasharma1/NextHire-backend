const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const cors =require('cors');
const app = express()
const port = process.env.PORT


app.use(cors());
app.use(express.json());

//connecting to MongoDb
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDbConnected"))
    .catch((err) => console.log("Error:", err))



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const cors =require('cors');
const app = express()
const port = process.env.PORT;
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');


app.use(cors());
app.use(express.json());

//connecting to MongoDb
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDbConnected"))
    .catch((err) => console.log("Error:", err))


app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

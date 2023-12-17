const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const userRoutes  = require('./routes/userRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
const commentRoutes = require('./routes/commentRoutes.js')


app = express()

app.use(cors());
app.use(express.urlencoded({extended: false}));

dotenv.config()
connectDB()

app.use('/user', userRoutes)
app.use('/post', postRoutes)
app.use('/comment', commentRoutes)


const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

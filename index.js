const express = require('express');
const mongoose=require("mongoose")
const Collection = require('./collection/authcollection')
const authRoutes = require('./routes/authRoutes')
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const viewPaths = path.join(__dirname, 'view'); 
// const publicPaths = path.join(__dirname, 'public');

app.set('views', viewPaths); 
// app.use(express.static(publicPaths))
app.use(express.static('public'));



// app.set('views', path.join(__dirname, 'view'))
app.set('view engine', 'ejs')



app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

app.use(authRoutes)

const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});



mongoose.connect(process.env.MONGOOSE_CONNECT)
    .then(() => {
        console.log("Database connected");
        app.use(Collection); 
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });

const express = require('express');
const mongoose=require("mongoose")
const Collection = require('./collection/authcollection')
const authRoutes = require('./routes/authRoutes')
const path = require('path');
const cookieParser = require('cookie-parser');

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

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});



mongoose.connect("mongodb+srv://admin:smartwork123@cluster0.zq3u635.mongodb.net/Node-Crud?retryWrites=true&w=majority")
.then(()=>{
    console.log("Database connected")
})
.catch(()=>{
    console.log("error")
})

app.use(Collection)
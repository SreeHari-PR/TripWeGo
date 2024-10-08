require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors')
const path = require('path');
const connecion=require('./db')
const userRoutes=require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const managerRoutes = require('./routes/managerRoutes');

//db connection
connecion();


//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173'
  }))

  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//routes
app.use('/api/users',userRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/manager', managerRoutes);

const port= process.env.PORT||5000;

app.listen(port,()=>{
    console.log(`server is listening in port..${port}`)
})

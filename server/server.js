// server

const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

// Authentication

const authRoutes = require('./routes/auth');
const ClientProfileRoutes = require('./routes/riderProfile');  
const bookingRoutes = require('./routes/booking');  

const mongoURI = 'mongodb+srv://mubasilbehzad012:mubasil012@cluster0.eu0nw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(mongoURI).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log('Error:', err);
})

app.get('/', (req, res) => {
    res.send({status: "Started"});
})


const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: 'http://192.168.0.110:8081',
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders:[
            'Content-Type',
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma',
        ],
        credentials: true
    })
)

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/client', ClientProfileRoutes);
app.use('/api/booking', bookingRoutes);

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})


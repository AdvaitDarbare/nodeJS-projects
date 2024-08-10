const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

// Import routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();  // create an express app

// Middleware
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Logging middleware
}



app.use(express.json()); // Body parser middleware
app.use(express.static(`${__dirname}/public`)); // Serve static files

// Custom middleware example
app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Mount routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
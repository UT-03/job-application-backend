require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const HttpError = require('./util/HttpError');
const userRoutes = require('./routes/User');
const immigrationFirmRoutes = require('./routes/ImmigrationFirm');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Handling cors errors
app.use(cors());

// Routes here
app.use('/api/user', userRoutes);
app.use('/api/immigration-firm', immigrationFirmRoutes);

// Default=> If no route matches the url
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
})

// Handling error
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'Something went wrong, please try again later.' });
});

// Connecting to database and starting the server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to database!")
        app.listen(process.env.PORT);
    })
    .then(() => {
        console.log(`Server started at http://localhost:${process.env.PORT}`);
    })
    .catch(err => {
        console.log(err);
    });
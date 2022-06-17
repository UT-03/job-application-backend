const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../util/HttpError');
const Applicant = require('../models/Applicant');
const ImmigrationFirm = require('../models/ImmigrationFirm');

const signup = async (req, res, next) => {
    // If inputs are invalid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 406));
    }

    const { name, email, password, userType } = req.body;

    // setting model type- Applicant or Immigration Firm
    let userModel;
    if (userType === 'applicant')
        userModel = Applicant;
    else if (userType === 'immigration-firm')
        userModel = ImmigrationFirm;

    // Searching any existing user with provided email
    let existingUser;
    try {
        existingUser = await userModel.findOne({ email: email });
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    // If user already exists
    if (existingUser) {
        const error = new HttpError('User exists already, please login instead.', 406);
        return next(error);
    }

    // Hashing the password
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    // Creating new user
    let newUser;
    if (userType === 'applicant') {
        newUser = new Applicant({
            name: name,
            email: email,
            password: hashedPassword,
            isGoogleSignedIn: false
        });
    }
    else if (userType === 'immigration-firm') {
        newUser = new ImmigrationFirm({
            name: name,
            email: email,
            password: hashedPassword,
            isGoogleSignedIn: false,
            jobsPosted: []
        });
    }

    // Saving new user in the DB
    try {
        await newUser.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    // Generating token
    let token;
    try {
        token = jwt.sign(
            { userId: newUser.id },
            `${process.env.SECRET_TOKEN}`
        );
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    // sending new user creation status response
    res
        .status(201)
        .json({
            token: token,
            userType: userType
        })
}

const login = async (req, res, next) => {
    const { email, password, userType } = req.body;

    // setting model type- Applicant or Immigration Firm
    let userModel;
    if (userType === 'applicant')
        userModel = Applicant;
    else if (userType === 'immigration-firm')
        userModel = ImmigrationFirm;

    // Searching existing user with provided email
    let existingUser;
    try {
        existingUser = await userModel.findOne({ email: email });
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    // If user does not exist
    if (!existingUser) {
        console.log(err);
        const error = new HttpError('User does not exist, please try signin instead.', 404);
        return next(error);
    }

    // If user is present but signed in with google
    if (existingUser.isGoogleSignedIn) {
        const error = new HttpError('This email is registered with Google signin service. Please use Google signin to continue.', 406);
        return next(error);
    }

    // Checking if password is correct
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    // If password is incorrect
    if (!isValidPassword) {
        const error = new HttpError('Invalid credentials, could not log you in.', 406);
        return next(error);
    }

    // Generating token if password is correct
    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id },
            `${process.env.SECRET_TOKEN}`
        );
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    // Sending response
    res
        .status(200)
        .json({
            token: token,
            userType: userType
        })
}

const googleSignin = async (req, res, next) => {
    const { name, email, userType } = req.body;

    // setting model type- Applicant or Immigration Firm
    let userModel;
    if (userType === 'applicant')
        userModel = Applicant;
    else if (userType === 'immigration-firm')
        userModel = ImmigrationFirm;

    // Searching existing user with provided email
    let existingUser;
    try {
        existingUser = await userModel.findOne({ email: email });
    } catch (err) {
        const error = new HttpError();
        return next(error);
    }

    // If user does not exist
    if (!existingUser) {
        existingUser = new userModel({
            name: name,
            email: email,
            isGoogleSignedIn: true,
            userType: userType
        });

        // Saving new user in the DB
        try {
            await existingUser.save();
        } catch (err) {
            console.log(err);
            const error = new HttpError();
            return next(error);
        }
    }

    // If user already exists- generating token
    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id },
            `${process.env.SECRET_TOKEN}`
        );
    } catch (err) {
        const error = new HttpError();
        return next(error);
    }

    // Sending response
    res
        .status(200)
        .json({
            token: token,
            userType: userType
        })
}

module.exports = {
    signup,
    login,
    googleSignin
}
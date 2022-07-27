//Importing Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const helmet = require("helmet");

//Importing Models
const UserModel = require("./UserModel");
const UserCredentialsModel = require("./UserCredentialsModel")
const DriverModel = require("./DriverModel");
const DriverCredentialsModel = require("./DriverCredentialsModel")
const RideModel = require("./RideModel")

//App Variables
const myApp = express();
const port = 3050;

//Using Middleware Body-Parser, CORS
myApp.use(express.json());
myApp.use(cors());
myApp.use(helmet());

//MongoDB Connection
const connectDB = async () => {
    const response = await mongoose.connect("mongodb://localhost:27017/RideShareNode");
}
connectDB();

//Requests

myApp.get('/', async (req, res) => {
    res.status(200).json({ status: true, data: "Hello There" });
});

myApp.get('/Test', async (req, res) => {
    res.status(200).json({ status: true, data: "Test Passed" });
});

//get Ride
myApp.get('/RideHistory', async (req, res) => {
    const ride = await RideModel.find();
    res.status(200).json({ status: true, data: ride });
});

//get User
myApp.get('/User/:id', async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    res.status(200).json({ status: true, data: user });
});

//get Driver
myApp.get('/Driver/:id', async (req, res) => {
    const driver = await DriverModel.findById(req.params.id);
    res.status(200).json({ status: true, data: driver });
});

//get Driver in an Area
myApp.get('/Driver', async (req, res) => {
    const driver = await DriverModel.find;
    res.status(200).json({ status: true, data: driver });
});

//post Ride
myApp.post('/Ride', async (req, res) => {
    const ride = await RideModel.create(req.body);
    res.status(200).json({ status: true, data: ride });
});

//User Email Already Exists Check
myApp.post('/UserEmailCheck', async (req, res) => {
    try {
        const userExists = await UserModel.find({ email_id: req.body.email_id });
        console.log(req.body.email_id)
        if (!userExists.length) {
            res.status(200).json({ exists: false });
            console.log("200");
        }
        else
            res.status(200).json({ exists: true, message: 'Email Already Exists' });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Something Went Wrong' });
    }
});

//post User
myApp.post('/UserCreate', async (req, res) => {
    try {
        const userExists = await UserModel.find({ email_id: req.body.email_id });
        if (userExists.length) {
            res.status(400).json({
                errors: { duplicate: ['Email Id is already registered'] }
            })
            throw new Error('Email Id is already registered')
        }
        const user = new UserModel(req.body);
        const userCred = new UserCredentialsModel(req.body);
        userCred.save().then(() => {
            user.save().then(() => {
                res.status(200).json({ message: 'Account Created' });
            })
                .catch(err => {
                    res.status(400).json({ message: 'A/c Created but Details not Added' })
                })
        })
            .catch(err => {
                res.status(400).json({ message: 'Account Creation Unsuccessful' })
            })
    }
    catch (err) {
        console.log(err);
    }
});

//post User Login
myApp.post('/UserLogin', async (req, res) => {
    try {
        const expectedUser = req.body;
        if (expectedUser.email_id == "")
            res.status(400).json({ errors: { message: 'Email Required' } });
        else {
            const userExists = await UserCredentialsModel.find({ email_id: expectedUser.email_id });
            if (!userExists.length) {
                res.status(200).json({ valid: false, message: 'Incorrect Email' })
                throw new Error('Account Does Not Exist')
            }
            else {
                const user = userExists[0]
                if (user.password === expectedUser.password) {
                    const user2 = await UserModel.find({ email_id: expectedUser.email_id });
                    res.status(200).json({ valid: true, message: 'User Logged In', userid: user2[0]._id });
                }
                else {
                    res.status(200).json({ valid: false, message: 'Incorrect Password' });
                }
                console.log('Exp', expectedUser);
                console.log('act', user);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});

//post Driver
myApp.post('/Driver', async (req, res) => {
    try {
        const driverExists = await DriverModel.find({ email_id: req.body.email_id });
        if (driverExists.length) {
            res.status(400).json({
                errors: { duplicate: ['Email Id is already registered'] }
            })
            throw new Error('Email Id is already registered')
        }
        const driver = new DriverModel(req.body);
        const driverCred = new DriverCredentialsModel(req.body);
        driverCred.save().then(() => {
            driver.save().then(() => {
                res.status(200).json({ message: 'Account Created' });

            })
                .catch(err => {
                    res.status(400).json({ message: 'A/c Created but Details not Added' })
                })
        })
            .catch(err => {
                res.status(400).json({ message: 'Account Creation Unsuccessful' })
            })
    }
    catch (err) {
        console.log(err);
    }
});

//put Ride
myApp.put("/Ride/:id", async (req, res) => {
    const ride = await RideModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: true, data: ride });
})

//Listener
myApp.listen(port, () => {
    console.log("Listening at Port 3050")
});

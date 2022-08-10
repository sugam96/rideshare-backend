//Importing Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const helmet = require("helmet");

//Importing Models
const UserModel = require("./UserModel");
const UserCredentialsModel = require("./UserCredentialsModel");
const DriverModel = require("./DriverModel");
const DriverCredentialsModel = require("./DriverCredentialsModel");
const RideModel = require("./RideModel");
const DriverLocationModel = require("./DriverLocationModel");
const RideRequestModel = require("./RideRequestModel");

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
    //console.log('Here1', req.params.id);
    //console.log('Here2', req.query);
    // res.status(200).json({ status: true, data: user });
    try {
        const user = await UserModel.findById(req.params.id);
        if (user === null) {
            res.status(200).json({ status: false, message: 'No Such User' });
            console.log("400");
        }
        else {
            res.status(200).json({ status: true, data: user });
        }
    }
    catch (err) {
        console.log("Error: /User/:id Get Request");
        res.status(200).json({ status: false, message: 'Something Went Wrong' });
    }
});

//get Driver Profile
myApp.get('/Driver/:id', async (req, res) => {
    //console.log('Here1', req.params.id);
    //console.log('Here2', req.query);
    // res.status(200).json({ status: true, data: user });
    try {
        const driver = await DriverModel.findById(req.params.id);
        if (driver === null) {
            res.status(200).json({ status: false, message: 'No Such Driver' });
            console.log("400");
        }
        else {
            res.status(200).json({ status: true, data: driver });
        }
    }
    catch (err) {
        console.log("Error: /Driver/:id Get Request");
        res.status(200).json({ status: false, message: 'Something Went Wrong' });
    }
});


//get Drivers in an Area
myApp.get('/Drivers', async (req, res) => {
    const drivers = await DriverLocationModel.find();
    console.log("Ds", drivers);
    res.status(200).json({ status: true, data: drivers });
    console.log("Sending Driver Data");
});

//get Driver Location
myApp.get('/DriverLocation', async (req, res) => {
    console.log("Sending Driver Location");
    console.log("Sending Driver Location", req.body);
    
    const driverLoc = await DriverLocationModel.findOne({ driver_id: req.body.driver_id });
    res.status(200).json({ status: true, data: driverLoc.location });
    
});
//get Rides
myApp.get('/GetRides', async (req, res) => {
    const Rides = await RideRequestModel.find();
    console.log("Rides", Rides);
    res.status(200).json({ status: true, data: Rides });
    console.log("Sending Ride Requests");
});
//get Rides Data
myApp.get('/GetRidesData', async (req, res) => {
    const Rides = await RideModel.find();
    const Riders = await UserModel.find();
    const Drivers = await DriverModel.find();
    const RideData = {};
    res.status(200).json({ status: true, Rides: Rides, Riders: Riders, Drivers: Drivers })
})


//post Ride
myApp.post('/Ride', async (req, res) => {
    const ride = await RideModel.create(req.body);
    res.status(200).json({ status: true, data: ride });
});

//post User Email Already Exists Check
myApp.post('/UserEmailCheck', async (req, res) => {
    try {
        const userExists = await UserModel.find({ email_id: req.body.email_id });
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

//post Create User
myApp.post('/UserCreate', async (req, res) => {
    try {
        const userExists = await UserModel.find({ email_id: req.body.email_id });
        if (userExists.length) {
            res.status(400).json({
                errors: { duplicate: ['Email Id is already registered'] }
            })
            throw new Error('Email Id is already registered')
        }
        else {
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
                    const userUpdated = await UserModel.find({ email_id: expectedUser.email_id });
                    res.status(200).json({ valid: true, message: 'User Logged In', userid: userUpdated[0]._id, firstname: userUpdated[0].first_name });
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


//post Driver Email Already Exists Check
myApp.post('/DriverEmailCheck', async (req, res) => {
    try {
        const driverExists = await DriverModel.find({ email_id: req.body.email_id });
        if (!driverExists.length) {
            res.status(200).json({ status: true, exists: false });
            console.log("Email Check: Does Not Exists");
        }
        else
            res.status(200).json({ status: true, exists: true, message: 'Email Already Exists' });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ status: false, message: 'Something Went Wrong' });
    }
});

//post Create Driver
myApp.post('/DriverCreate', async (req, res) => {
    try {
        const driverExists = await DriverModel.find({ email_id: req.body.email_id });
        console.log(req.body);
        if (driverExists.length) {
            console.log("Email Exists");
            res.status(400).json({ status: false, message: 'Email Already Registered' })
        }
        else {
            const driver = new DriverModel(req.body);
            const driverCred = new DriverCredentialsModel(req.body);
            driverCred.save().then(() => {
                driver.save().then(() => {
                    console.log('Account Created');
                    res.status(200).json({ status: true, message: 'Account Created' });
                })
                    .catch(err => {
                        console.log("Error3", err);
                        res.status(400).json({ status: false, message: 'A/c Created but Details not Added' })
                    })
            })
                .catch(err => {
                    console.log("Error2", err);
                    res.status(400).json({ status: false, message: 'Account Creation Unsuccessful' })
                })
        }
    }
    catch (err) {
        console.log("Error1", err);
    }
});


//post Driver Login
myApp.post('/DriverLogin', async (req, res) => {
    try {
        const expectedDriver = req.body;
        if (expectedDriver.email_id == "")
            res.status(400).json({ status: false, message: 'Email Required' });
        else {
            const driverExists = await DriverCredentialsModel.find({ email_id: expectedDriver.email_id });
            if (!driverExists.length) {
                res.status(200).json({ status: false, message: 'Incorrect Email' })
            }
            else {
                const driver = driverExists[0]
                if (driver.password === expectedDriver.password) {
                    const driverUpdated = await DriverModel.find({ email_id: expectedDriver.email_id });
                    res.status(200).json({ status: true, message: 'Driver Logged In', driverid: driverUpdated[0]._id, firstname: driverUpdated[0].first_name });
                }
                else {
                    res.status(200).json({ status: false, message: 'Incorrect Password' });
                }
                console.log('Exp', expectedDriver);
                console.log('act', driver);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});

//post Driver Location
myApp.post('/DriverLocationUpdate', async (req, res) => {
    try {
        console.log("Updating Driver Location");
        const driverLocInfo = req.body;
        console.log('DLI', driverLocInfo);
        if (driverLocInfo.driver_id == "")
            res.status(200).json({ status: false, message: 'Driver Id Required' });
        else {
            const driverExists = await DriverLocationModel.find({ driver_id: driverLocInfo.driver_id });
            console.log("DE", driverExists);
            if (driverExists.length) {
                console.log("Updating", driverExists[0].location)
                try {
                    prev_location = driverExists[0].location;
                    const upd = await DriverLocationModel.updateOne({ driver_id: driverLocInfo.driver_id }, { location: driverLocInfo.location });

                    if (driverLocInfo.location !== prev_location) {
                        console.log("Updating Prev", prev_location);
                        try {
                            const updt = await DriverLocationModel.updateOne({ driver_id: driverLocInfo.driver_id }, { previous_location: prev_location });
                        }
                        catch (error) {
                            console.log("Updating Prev Failed");
                        }
                    }
                    res.status(200).json({ status: true, message: 'Location Updated' });
                } catch (error) {
                    console.log(error);
                    res.status(200).json({ status: false, message: 'Location Cannot Be Updated' })
                }
            }
            else {
                console.log("Creating")
                const driverLocUpdate = new DriverLocationModel(driverLocInfo);
                driverLocUpdate.save().then(() => {
                    res.status(200).json({ status: true, message: 'Location Updated' });
                })
                    .catch(err => {
                        console.log("Error3", err);
                        res.status(200).json({ status: false, message: 'Location Cannot Be Updated' })
                    })
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(200).json({ status: false, message: 'Driver Location Update Not Working' })
    }
});


//post Ride Request
myApp.post('/RideRequest', async (req, res) => {
    console.log("Ride Request Received");
    try {

        const newReqData = req.body;
        console.log(newReqData);
        const requestExists = await RideRequestModel.find({ user_id: newReqData.user_id })
        console.log("RE", requestExists);
        if (requestExists.length) {
            console.log("Updating Ride Req");
            try {
                console.log("Trying");
                const updatingReq = await RideRequestModel.updateOne({ user_id: newReqData.user_id }, newReqData);
                let count = 0;
                let checkRequestAccept = setInterval((async function a() {
                    count++;
                    console.log("checking");
                    const ride = await RideModel.findOne({ request_id: requestExists[0]._id });
                    //console.log("Ride", ride);
                    if (count > 10) {
                        clearInterval(checkRequestAccept);
                        res.status(200).json({ status: false, message: 'No Drivers in Your Area' });
                    }
                    if (ride !== null) {
                        clearInterval(checkRequestAccept);
                        console.log("Driver Found");
                        const driver = await DriverModel.findById(ride.driver_id);
                        console.log("Data", ride, driver);
                        res.status(200).json({ status: true, message: 'Driver Found', ride_data: ride, driver_data: driver });
                    }
                }), 5000);


            }
            catch (error) {
                console.log("Updating Req Failed", error);
                //res.status(400).json({ status: false, message: "Request couldn't be updated" })
            }
        }
        else {
            console.log("Creating Ride Req");
            const newRideRequest = new RideRequestModel(req.body);
            newRideRequest.save().then(() => {
                let count = 0;
                let checkRequestAccept = setInterval((async function a() {
                    count++;
                    console.log("checking");
                    const ride = await RideModel.findOne({ request_id: newRideRequest._id });
                    //console.log("Ride", ride);
                    if (count > 10) {
                        clearInterval(checkRequestAccept);
                        res.status(200).json({ status: false, message: 'No Drivers in Your Area' });
                    }
                    if (ride !== null) {
                        clearInterval(checkRequestAccept);
                        console.log("Driver Found");
                        const driver = await DriverModel.findById(ride.driver_id);
                        console.log("Data", ride, driver);
                        res.status(200).json({ status: true, message: 'Driver Found', ride_data: ride, driver_data: driver });
                    }
                }), 5000);
            })
                .catch(err => {
                    console.log("Error1", err);
                    res.status(400).json({ status: false, message: 'Request Cannot be Registered' })
                })

        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ status: false, message: 'Something Went Wrong' });
    }
});


//post Ride Acceptance

myApp.post('/RideAccept', async (req, res) => {
    console.log("Inside Ride Accept");
    try {
        const request_id = req.body.request_id;
        console.log(req.body);
        const requestExists = await RideRequestModel.findById(request_id);
        if (requestExists === null) {
            res.status(200).json({ status: false, message: 'No Such Ride Request' });
            console.log("400 at Ride Request");
        }
        else {
            const user = await UserModel.findById(requestExists.user_id);
            const newRideData = { ...requestExists._doc, request_id: request_id, driver_id: req.body.driver_id, status: "Accepted By Driver" };
            console.log("nRD", newRideData);
            const newRide = new RideModel(newRideData);
            newRide.save().then(() => {
                res.status(200).json({ status: true, data: newRideData, userData: user, message: 'Request Accepted' });
                console.log("Req Accepted");
            })
                .catch(err => {
                    console.log("Error1", err);
                    res.status(400).json({ status: false, message: 'Unable to Accept Req' })
                })
        }

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

//put User
myApp.put('/UserUpdate/:id', async (req, res) => {
    try {
        const expectedUser = req.body;
        if (expectedUser.email_id == "")
            res.status(400).json({ status: false, message: 'Email Required' });
        else {
            const userExists = await UserCredentialsModel.find({ email_id: expectedUser.email_id });
            const userExists2 = await UserModel.find({ email_id: expectedUser.email_id });
            if (!userExists.length) {
                res.status(200).json({ status: false, message: 'Incorrect Email' })
                throw new Error('Account Does Not Exist')
            }
            else {
                const user = userExists[0]
                if (user.password === expectedUser.password) {
                    try {
                        const userUpdated = await UserModel.findByIdAndUpdate(req.params.id, req.body);
                        if (user.email_id !== expectedUser.email_id) {
                            const emailUpdate = await UserCredentialsModel.findOneAndUpdate({ email_id: user.email_id }, { email_id: expectedUser.email_id });
                        }
                        console.log(userUpdated);
                        if (userUpdated !== null) {
                            res.status(200).json({ status: true, message: 'Update Successfull', email_id: userUpdated.email_id, firstname: userUpdated.first_name });
                        }
                        else {
                            res.status(200).json({ status: false, message: 'Something Went Wrong2' });
                        }
                    } catch (error) {
                        res.status(200).json({ status: false, message: 'Something Went Wrong1' });
                        console.log('Error: at /UserUpdate/:id findByIdAndUpdate');
                    }
                }
                else {
                    res.status(200).json({ status: false, message: 'Incorrect Password' });
                }
                // console.log('Exp', expectedUser);
                // console.log('act1', user);
                // console.log('act2', userExists2[0]);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});

//put Driver
myApp.put('/DriverUpdate/:id', async (req, res) => {
    try {
        const updatedDriver = req.body;
        if (updatedDriver.email_id == "")
            res.status(400).json({ status: false, message: 'Email Required' });
        else {
            const driverExists = await DriverCredentialsModel.find({ email_id: updatedDriver.email_id });
            const driverExists2 = await DriverModel.find({ email_id: updatedDriver.email_id });
            if (!driverExists.length) {
                res.status(200).json({ status: false, message: 'Incorrect Email' })
                throw new Error('Account Does Not Exist')
            }
            else {
                const driver = driverExists[0]
                if (driver.password === updatedDriver.password) {
                    try {
                        const driverUpdated = await DriverModel.findByIdAndUpdate(req.params.id, req.body);
                        if (driver.email_id !== updatedDriver.email_id) {
                            const emailUpdate = await DriverCredentialsModel.findOneAndUpdate({ email_id: driver.email_id }, { email_id: updatedDriver.email_id });
                        }
                        console.log(driverUpdated);
                        if (driverUpdated !== null) {
                            res.status(200).json({ status: true, message: 'Update Successfull', email_id: driverUpdated.email_id, firstname: driverUpdated.first_name });
                        }
                        else {
                            res.status(200).json({ status: false, message: 'Something Went Wrong2' });
                        }
                    } catch (error) {
                        res.status(200).json({ status: false, message: 'Something Went Wrong1' });
                        console.log('Error: at /DriverUpdate/:id findByIdAndUpdate');
                    }
                }
                else {
                    res.status(200).json({ status: false, message: 'Incorrect Password' });
                }
                // console.log('Exp', expectedDriver);
                // console.log('act1', driver);
                // console.log('act2', driverExists2[0]);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});

//Listener
myApp.listen(port, () => {
    console.log("Listening at Port 3050")
});

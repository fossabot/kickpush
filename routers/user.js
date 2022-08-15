const express = require('express');
const geocoder = require('../utils/geocoder');
const ip = require('ip');

const auth = require('../middleware/auth/auth');
const UserModel = require('../models/user');
const { User } = UserModel;

const router = new express.Router();

/**
 * @route   POST /register
 * @desc    Register a new user
 */
router.post('/register', async (req, res) => {
  const user = new User(req.body);

  if (user.accountType == UserModel.INSTRUCTOR_ACCOUNT_TYPE) {
    user.generateDefaultInstructorProfile();
  } else {
    user.generateDefaultStudentProfile();
  }

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    console.log('Failed to register user: ', err);
    res.status(500).send(err);
  }
});

/**
 * @route   POST /login
 * @desc    Login an existing user
 */
router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    await user.populate('connections', ['firstName', 'lastName', 'avatar']).execPopulate();

    res.send({ user, token });
  } catch (err) {
    console.log('Failed to login in user: ', err);
    res.status(500).send();
  }
});

/**
 * @route   GET /loadUser
 * @desc    Load the current user
 */
router.get('/loadUser', auth, async (req, res) => {
  await req.user.populate('connections', ['firstName', 'lastName', 'avatar']).execPopulate();
  res.json(req.user);
});

/**
 * @route   POST /logout
 * @desc    Logout the current user
 */
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (err) {
    console.log('Failed to logout user: ' + err);
    res.status(500).send();
  }
});

/**
 * @route   POST /updateInstructorProfile
 * @desc    Update the instructors profile
 */
router.post('/updateInstructorProfile', auth, async (req, res) => {
  const user = req.user;
  user.instructorProfile = req.body.instructorProfile;

  try {
    await user.updateOne({ instructorProfile: req.body.instructorProfile }, { runValidators: true });
    await user.populate('connections', ['firstName', 'lastName', 'avatar']).execPopulate();

    res.json(user);
  } catch (err) {
    console.log('Failed to update user profile: ' + err);
    res.status(500).send();
  }
});

/**
 * @route   POST /updateStudentProfile
 * @desc    Update the students profile
 */
router.post('/updateStudentProfile', auth, async (req, res) => {
  const studentProfile = req.body.studentProfile;

  if (!studentProfile.familyMembers) {
    studentProfile.familyMembers = [];
  }

  req.user.studentProfile = req.body.studentProfile;

  try {
    await req.user.updateOne({ studentProfile: req.body.studentProfile }, { runValidators: true });
    res.json(req.user);
  } catch (err) {
    console.log('Failed to update user profile: ' + err);
    res.status(500).send();
  }
});

/**
 * @route   POST /updateLocation
 * @desc    Update the user's location
 */
router.post('/updateLocation', auth, async (req, res) => {
  let geoLocation;

  try {
    if (req.body.coordinates) {
      geoLocation = await geocoder.getGeoLocationFromCoordinates(req.body.coordinates.latitude, req.body.coordinates.longitude);
    } else if (req.body.address) {
      geoLocation = await geocoder.getGeoLocationFromAddress(req.body.address.city, req.body.address.state, req.body.address.zipCode);
    } else {
      res.status(400).send('No location provided');
    }

    req.user.location = {
      city: geoLocation.city,
      state: geoLocation.administrativeLevels.level1short,
      zipCode: geoLocation.zipcode || (await geocoder.getZipCodeFromCoordinates(geoLocation.latitude, geoLocation.longitude)),
      coordinates: [geoLocation.longitude, geoLocation.latitude]
    };

    await req.user.updateOne({ location: req.user.location });
    res.json(req.user);
  } catch (err) {
    console.log('Failed to update the users location: ', err);
    res.status(500).send();
  }
});

/**
 * @route   GET /getUser/:userId
 * @desc    Get a user by their unique id
 */
router.get('/getUser/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json(user);
  } catch (err) {
    console.log('Failed to get user: ', err);
    res.status(500).send();
  }
});

/**
 * @route   GET /getInstructors
 * @desc    Get all instructors within a certain distance of the users location
 */
router.get('/getInstructors', async (req, res) => {
  const location = req.query.location;
  const coordinates = await geocoder.getGeoLocationFromStringLocation(location);

  try {
    const instructors = await User.find({
      accountType: UserModel.INSTRUCTOR_ACCOUNT_TYPE,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [coordinates.longitude, coordinates.latitude]
          },
          $maxDistance: 80468 // 50 miles in meters
        }
      }
    });
    res.json(instructors);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

/**
 * @route   POST /deleteSocketId
 * @desc    Delete a socket id from the user's socket ids
 */
router.post('/deleteSocketId', auth, async (req, res) => {
  try {
    req.user.socketId = req.user.socketIds.filter((socketId) => socketId !== req.body.socketId);
    await req.user.save();
    res.status(200).send();
  } catch (err) {
    console.log('Failed to delete socket id: ' + err);
    res.status(500).send();
  }
});

module.exports = router;

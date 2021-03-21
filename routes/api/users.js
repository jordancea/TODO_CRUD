const express = require("express");
const router = express.Router();
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const auth = require("../../middleware/auth")
const User = require('../../models/User');
const { set } = require("mongoose");


//@route POST api/users
//@desc  Register user
//@access Public

router.post('/',[
    check("firstname", "First Name is required")
      .not()
      .isEmpty(),
      check("lastname", " Last Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 6
    })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 
    const {firstname, lastname, email, password} = req.body
    try {
        let user = await User.findOne({ email });

        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "User already Exists" }] });
        }

        user = new User({
            firstname,
            lastname,
            email,
            password
        })
            //Encript password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);
  
        await user.save();

        //Return jsonwebtoken

        const payload = {
            user: {
              id: user.id
            }
          };
    
          jwt.sign(payload, config.jwtSecret, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
          });
    } catch (error) {
      console.error(error.message);  
      res.status(500).send('Server error')
    }
});
    //@route POST api/users/activity
    //@desc  Add user activity
    //@access Private
router.post('/activity',[auth, [
      check("description", "Description is required")
        .not()
        .isEmpty(),
        check("status", " Status is required")
        .not()
        .isEmpty(),
      check("from", "From is required").not()
      .isEmpty(),
    ]], async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
      }
       const {description, status, from, to } = req.body
       const newActivity = {
         description,
         status,
         from,
         to
       }
       try {
         const user = await User.findOne({user: req.user._id});
         user.Activity.unshift(newActivity);
         await user.save();
         res.json(user);
       } catch (error) {
         console.error(error.msg)
         res.status(500).send('Server Error')
       }
    });

    // @route   DELETE api/users/activity
// @desc    Delete activty from user
// @access  Private
router.delete('/activity/:id',auth,
  async(req, res) => {
    try {
      const user = await User.findOne({user: req.user._id}); 

      //Get remove index
      const removeIndex = user.Activity.map(item => item._id).indexOf(req.params.id);
      user.Activity.splice(removeIndex, 1);
      await user.save();
      res.json(user);

    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }  
);

// @route   GET api/users/activity/:id
// @desc    Get single activty from user
// @access  Private

router.get('/activity/:id', auth, async(req, res) => {
  try {
    const user = await User.findOne({user: req.user._id});

    const activity = user.Activity;
    const singleActivity = activity.find(a => a._id = req.params.id )

    if (!singleActivity) return res.status(400).json({msg:"There is no activity for this user"});
    
     res.json(singleActivity);
  } catch (error) {
     console.error(error.message);
     res.status(500).send('Server error'); 
  }
});


    // @route   GET api/users/activity/
   // @desc    Get activites for user
  // @access  Private

router.get('/activity', auth, async(req, res) => {
  try {
    const user = await User.findOne({user: req.user._id});

    const activity = user.Activity;
    
    if (!activity) return res.status(400).json({msg:"There are no activities for this user"});
    
     res.json(activity);
  } catch (error) {
     console.error(error.message);
     res.status(500).send('Server error'); 
  }
});


router.put('/activity/:id', auth, async(req, res) => {

  try {
    const user = await User.findOne({user: req.user._id});
    let singleActivityIndex = user.Activity.findIndex(a => a._id = req.params.id);
     
    user.Activity[singleActivityIndex] = {...user.Activity[singleActivityIndex], ...req.body };
  
  await user.save()
  res.json(user.Activity[singleActivityIndex])
  }
  catch (error) {
     console.error(error.message);
     res.status(500).send('Server error'); 
  }
});


module.exports = router;
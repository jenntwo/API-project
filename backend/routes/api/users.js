const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
    //check if the email is already be used
       .custom(async (email, { req }) => {
        const user = await User.findOne({ where: { email } });
        if (user) {
          req.message =  "User already exists"
          req.status = 403;
          throw new Error('User with that email already exists');
      } else {
          return email;
      }
  })
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .custom(async (username, { req }) => {
        const user = await User.findOne({ where: { username } });
        if (user) {
          req.status = 403;
          req.message =  "User already exists"
          throw new Error('User with that username already exists');
      } else {
          return username;
      }
    })
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
      // /Error response with status 400
      // is given when body validations for the
      // email, firstName, or lastName are violated
    check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email address.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .isString()
    .withMessage('First name must be a string.'),
  check('lastName')
    .exists({ checkFalsy: true })
    .isString()
    .withMessage('Last name must be a string.'),
    handleValidationErrors
  ];


// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username,firstName,lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, username, hashedPassword, firstName, lastName });

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName:user.firstName,
        lastName:user.lastName,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );

// Error handling middleware for handling the custom error
// router.use((err, req, res, next) => {
//   if (err.message === 'User with that email already exists') {
//       return res.status(403).json({ error: err.message });
//   }

//   next(err);
// });


module.exports = router;

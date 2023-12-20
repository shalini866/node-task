const collection = require('../collection/authcollection')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const ejs = require('ejs')
const fs = require('fs').promises;
require('dotenv').config();


var userEmail = ''


async function hashPassword(password) {
  const res = await bcrypt.hash(password, 10)
  return res
}

async function compare(userPassword, hashPassword) {
  const res = await bcrypt.compare(userPassword, hashPassword);
  return res;
}


module.exports.home = (req, res) => {
 console.log(req.query.email)
  res.render("home", { email: req.query.email });
}


module.exports.login_get = (req, res) => {
  res.render('login');
 };


 module.exports.signup_get= (req, res) => {
  res.render('signup');
 };
 
 module.exports.logout_get = (req, res) => {
  console.log('Logout initiated');
  res.clearCookie('jwt');
  res.redirect('/login');
};

module.exports.reset_get = async (req, res) => {
  console.log('userEmail',userEmail)
  await sendResetPassword(userEmail);
  res.send("Check your Email ");
};

module.exports.resetPassword_get = (req,res) => {
  res.render('resetPassword')
}


module.exports.signup_post = async (req, res) => {
  console.log('Signup initiated');
  try {
    const check = await collection.findOne({ email: req.body.email });

    if (check) {
      console.log('User already exists');
      res.send("User already exists");
    } else {
      const jwtSecret = process.env.JWT_SECRET || 'defaultSecret'; 
      const token = jwt.sign({ email: req.body.email }, jwtSecret, { expiresIn: '1h' });
      const userData = {
        email: req.body.email,
        password: await hashPassword(req.body.password),
        token: token,
      };
      await collection.insertMany([userData]);

      res.locals.email = req.body.email;

      console.log('User successfully signed up:', userData);
      // res.render("home", { email: req.body.email });
      res.redirect(`/home?email=${req.body.email}`);
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send("Internal Server Error");
  }
};



module.exports.login_post = async (req, res) => {
  userEmail = req.body.email
  console.log('Login initiated');
  try {
    const check = await collection.findOne({ email: req.body.email });

    if (!check) {
      console.log('User not found');
      return res.send("User not found");
    }

    const passCheck = await compare(req.body.password, check.password);

    if (check && passCheck) {
      if (check.token) {
        console.log('Login successful');
        res.cookie("jwt", check.token, {
          maxAge: 600000,
          httpOnly: true,
        });
        //  res.render("home", { email: req.body.email });
        res.redirect(`/home?email=${req.body.email}`);

      } else {
        console.log('User token not found');
        res.send("User token not found");
      }
    } else {
      console.log('Wrong details');
      res.send("Wrong details");
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send("Internal Server Error");
  }
};



module.exports.resetPassword_post = async (req, res) => {
  try {
    const user = await collection.findOne({ email: req.body.email });

    if (!user) {
      console.log('User not found');
      return res.send("User not found");
    }

    // Verify old password
    const isOldPasswordValid = await compare(req.body.oldPassword, user.password);

    if (!isOldPasswordValid) {
      console.log('Old password is incorrect');
      return res.send("Old password is incorrect");
    }

    // Check if the new password and confirm password match
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.send("New password and confirm password do not match");
    }

    // Update the password in the database
    const hashedNewPassword = await hashPassword(req.body.newPassword);
    await collection.updateOne({ email: req.body.email }, { $set: { password: hashedNewPassword } });

    console.log('Password reset successfully');
    res.render("login");
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).send("Internal Server Error");
  }
};


async function sendResetPassword(userEmail) {
  const templateFile = 'view/reset.ejs';
  try {
    const transporter = nodemailer.createTransport({

      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: false,
      auth: {
        user: 'shalinisree@twilightsoftwares.com',
        pass: 'vfje vzbo ewhe pzsy',
      },
      timeout: 3000,
    });



    const template = await fs.readFile(templateFile, 'utf-8');
    const compiledTemplate = ejs.compile(template);
    const html = compiledTemplate({ username: 'John Doe', balance: 1000 });

    const mailOptions = {
      from: 'shalinisree@twilightsoftwares.com',
      to: userEmail,
      subject: 'Reset Your Password',
      html: html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);

  } catch (error) {
    console.error('Error sending email:', error);
  }
}



const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require('@sendgrid/mail')
const nodemailer = require("nodemailer");

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


// user create if email doesnt exist
// with async await
//register
exports.register = async (req, res) => {
    const { email } = req.body;
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 12;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }

    console.log(password)

    if (!email) {
        return res
            .status(422)
            .json({ err: "Please fill out all the given fields!" });
    }

    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ err: "Email already exist" });
        }
        // else if (password !== cpassword) {
        //     return res.status(422).json({ err: "possword doesnt match" });
        // }
        else {
            const user = new User({
                email,
                password
            });
            await user.save();

            // const msg = {
            //     to: user.email, // Change to your recipient
            //     from: {
            //         name: 'Hamza',
            //         email: 'hamzazaman91@gmail.com'
            //     }, // Change to your verified sender
            //     subject: 'Password for login',
            //     text: 'Thank you for sign up in our app',
            //     html: `'<h1>your password: ${password}</h1>`,
            // }

            // sgMail
            //     .send(msg)
            //     .then((response) => {
            //         console.log('responeee', response)
            //         console.log(response[0].statusCode)
            //         console.log(response[0].headers)
            //     })
            //     .catch((error) => {
            //         console.error(error)
            //     })

            let info = await transporter.sendMail({
                from: {
                    name: 'Hamza',
                    email: 'hamzazaman91@gmail.com'
                },
                to: user.email,
                subject: 'Password for login',
                text: 'Thank you for sign up in our app',
                html: `'<h1>your password: ${password}</h1>`,
            });


            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            res.status(201).json({ message: "User Registered Successfully." });
        }

        // const userRegister = await user.save();
        // if (userRegister) {
        //   res.status(201).json({ message: "User Registered Successfully." });
        // } else {
        //   res.status(500).json({ error: "User Registration Failed." });
        // }
    } catch (err) {
        console.log(err);
    }
};

//login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Invalid details" });
        }
        // console.log(email, password);

        const userLogin = await User.findOne({ email });
        console.log(userLogin);

        if (userLogin) {
            let token = jwt.sign({ id: userLogin._id }, process.env.SECRET_KEY);

            console.log(token);

            if (password != userLogin.password) {
                res.status(400).json({ err: "Password doesnt match" });
            } else {
                res.json({
                    data: "User signin successfully",
                    authToken: token,
                    userLogin: userLogin.email
                });
            }
        } else {
            res.status(400).json({ err: "Invalid Credentials" });
        }
    } catch (err) {
        console.log(err);
    }
};
const User = require('../model/User')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

require('dotenv').config()

const jwtSecret = process.env.JWTSECRET

exports.register = async (req, res, next) => {
    const { username, password, defaultlocation } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists, please choose a different username",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            password: hash,
            defaultlocation,
        });

        const maxAge = 24 * 60 * 60;
        const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            {
                expiresIn: maxAge, // 24 hours in seconds
            }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 24 hours in milliseconds
        });

        res.status(201).json({
            message: "User created successfully",
            user: user._id,
        });
    } catch (err) {
        res.status(500).json({
            message: "An error occurred while creating a user",
            error: err.message,
        });
    }
};


exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    // Check if the user entered the username and password
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or Password field is empty",
        });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: "Login not successful",
                error: "User not found with the above username",
            });
        }

        // Compare the entered password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const maxAge = 24 * 60 * 60;
            const token = jwt.sign(
                { id: user._id, username, defaultlocation: user.defaultlocation, role: user.role },
                jwtSecret,
                {
                    expiresIn: maxAge, // 24 hrs in seconds
                }
            );

            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000, // 24 hrs in milliseconds
            });

            res.status(200).json({
                message: "User successfully logged in",
                user: user._id,
                username: user.username,
                defaultlocation: user.defaultlocation,
                role: user.role,
            });
        } else {
            res.status(401).json({
                message: "Login not successful",
                error: "Invalid password",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "An error occurred",
            error: err.message,
        });
    }
};

exports.update = async (req, res, next) => {
    const { role, id } = req.body;

    // Verifying if both role and id are given
    if (role && id) {
        // Verifying if the role is admin
        if (role == 'admin') {
            try {
                const user = await User.findById(id);

                // Verify that the user is not admin previously
                if (user.role !== "admin") {
                    user.role = role;
                    await user.save();
                    res.status(200).json({ message: "Update Successful", user });
                } else {
                    res.status(400).json({ message: "User is already an admin" });
                }
            } catch (err) {
                res.status(400).json({ message: "An error occurred", error: err.message });
            }
        } else {
            res.status(200).json({ message: "Role is not admin" });
        }
    } else {
        res.status(400).json({ message: "Role or id not present" });
    }
};

exports.deleteUser = async (req, res, next) => {
    const { id } = req.body;

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(201).json({ message: "User successfully deleted", user });
    } catch (error) {
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};

exports.getUsers = async (req, res, next) => {
    await User.find({})
    .then(users => {
        const userFunction = users.map(user => {
            const container = {}
            container.username = user.username
            container.role = user.role
            return container
        })
        res.status(200).json({user: userFunction})
    })
    .catch(err =>{
        res.status(401).json({
            message: "Not Successful",
            error: err.message,
        })
    })
};
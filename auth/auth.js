const User = require('../model/User')

exports.register = async (req, res, next)=> {
    const {username, password} = req.body

    if (password.length < 6){
        return res.status(400).json({message: "Password less than 6 characters"})
    }
    try{
        await User.create({
            username,
            password,
        })
        .then(user => 
            res.status(200).json({
                message: "User created Successfully",
                user,
            })
        )
    }catch(err){
        res.status(401).json({
            message: "An error occured while creating a user",
            error: error.message,
        })
    }
}

exports.login = async (req, res, next) => {
    const { username, password } = req.body

    //check if user entered the username and password
    if(!username || !password){
        return res.status(400).json({
            message: "Username or Password is empty",
        })
    }

    try{
        const user = await User.findOne({ username, password })
        if(!user){
            res.status(401).json({
                message: "Login not successful",
                error: "User not found that matches with the above credentials"
            })
        }else{
            res.status(200).json({
                message: "Login Successful",
                user,
            })
        }
    }catch(err){
        res.status(400).json({
            message: "An error occured",
            error: error.message,
        })
    }
}

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
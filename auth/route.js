const express = require("express")

const {adminAuth} = require("../middleware/auth.js")

const router = express.Router()
const { register, login, update, deleteUser, getUsers } = require("./auth")

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/update").put(adminAuth, update)
router.route("/deleteUser").delete(adminAuth, deleteUser)
router.route("/getUsers").get(adminAuth, getUsers)

module.exports = router
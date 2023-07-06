const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    createdDate: String,
    password: String,
    role: String,
})

const userModel = mongoose.model("Users", userSchema)

module.exports = {
    userModel
}
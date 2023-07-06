const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    userID: { type: mongoose.ObjectId, ref: 'Users' },
    movieID: { type: mongoose.ObjectId, ref: 'Movies' },
    platiniumTickets: { type: [String] },
    goldTickets: { type: [String] },
    silverTickets: { type: [String] }
})

const cartModel = mongoose.model("Cart", cartSchema)

module.exports = {
    cartModel
}
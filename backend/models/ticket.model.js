const mongoose = require("mongoose")

const ticketSchema = mongoose.Schema({
    userID: { type: mongoose.ObjectId, ref: 'Users' },
    movieID: { type: mongoose.ObjectId, ref: 'Movies' },
    platiniumTickets: { type: [String] },
    goldTickets: { type: [String] },
    silverTickets: { type: [String] },
    createdDate: String
})

const ticketModel = mongoose.model("Tickets", ticketSchema)

module.exports = {
    ticketModel
}
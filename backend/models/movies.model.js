const mongoose = require("mongoose")

const moviesSchema = mongoose.Schema({
    movieName: String,
    totalTickets: Number,
    totalPlatiniumTickets: Number,
    totalGoldTickets: Number,
    totalSilverTickets: Number,
    bookedPlatiniumSeats: { type: [String] },
    bookedGoldSeats: { type: [String] },
    bookedSilverSeats: { type: [String] },
    remainingPlatiniumTickets: Number,
    remainingGoldTickets: Number,
    remainingSilverTickets: Number,
    openForSale: Boolean,
    closingDate: String,
    createdDate: String
})

const movieModel = mongoose.model("Movies", moviesSchema)

module.exports = {
    movieModel
}
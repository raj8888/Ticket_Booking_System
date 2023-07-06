const express = require("express")
const { movieModel } = require("../models/movies.model")
const movieRouter = express.Router()
const { authorization } = require("../middlewares/authorization.middleware")
const { authenticator } = require("../middlewares/authenticator.middleware")

movieRouter.use(authenticator)

// getting all movies
movieRouter.get("/all", async (req, res) => {
    try {
        let data = await movieModel.find()
        res.status(200).send({ "message": "All movies", allData: data })
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ "message": "Sorry :( , Server Error" })
    }
})

// get selected movie only
movieRouter.get("/single/:movieID", async (req, res) => {
    try {
        let movieID = req.params.movieID
        let data = await movieModel.findById(movieID)
        res.status(200).send({ "message": "Movie Information", movieData: data })
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ "message": "Sorry :( , Server Error" })
    }
})

//create movies with tickets
movieRouter.post("/create", authorization(['admin']), async (req, res) => {
    try {
        let data = req.body
        let createdDate = new Date().toLocaleDateString()
        let newMovie = new movieModel({
            movieName: data.movieName,
            totalTickets: data.totalTickets,
            totalPlatiniumTickets: data.totalPlatiniumTickets,
            totalGoldTickets: data.totalGoldTickets,
            totalSilverTickets: data.totalSilverTickets,
            bookedPlatiniumSeats: [],
            bookedGoldSeats: [],
            bookedSilverSeats: [],
            remainingPlatiniumTickets: data.totalPlatiniumTickets,
            remainingGoldTickets: data.totalGoldTickets,
            remainingSilverTickets: data.totalSilverTickets,
            openForSale: true,
            closingDate: data.closingDate,
            createdDate: createdDate
        })
        await newMovie.save()
        res.status(201).send({ 'message': "Movie Created Successfully!" })
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ "message": "Sorry :( , Server Error" })
    }
})


//update the status of movie 
movieRouter.patch("/update/status/:movieID", async (req, res) => {
    try {
        let movieID = req.params.movieID
        await movieModel.findByIdAndUpdate(movieID, { openForSale: false })
        res.status(201).send({ 'message': "Tickets Sales Closed Successfully!" })
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ "message": "Sorry :( , Server Error" })
    }
})

// delete that selected movie
movieRouter.delete("/delete/:movieID", authorization(['admin']), async (req, res) => {
    try {
        let movieID = req.params.movieID
        await movieModel.findByIdAndDelete(movieID)
        res.status(201).send({ 'message': "Movie Deleted Successfully!" })
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ "message": "Sorry :( , Server Error" })
    }
})


module.exports = {
    movieRouter
}

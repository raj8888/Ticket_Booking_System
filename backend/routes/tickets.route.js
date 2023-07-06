const express = require("express")
const { movieModel } = require("../models/movies.model")
const { ticketModel } = require("../models/ticket.model")
const { userModel } = require("../models/user.model")
const { cartModel } = require("../models/cart.model")
const ticketRouter = express.Router()
const { authorization } = require("../middlewares/authorization.middleware")
const { authenticator } = require("../middlewares/authenticator.middleware")

ticketRouter.use(authenticator)

// book tickets for selected movie
ticketRouter.post("/book/movie/:movieID", async (req, res) => {
    try {
        let data = req.body
        let userID = req.body.userID
        let movieID = req.params.movieID
        let totalPlatinumTics = req.body.totalPlatiniumTickets
        let totalGoldTics = req.body.totalGoldTickets
        let totalSilverTics = req.body.totalSilverTickets
        let pltCount = 0
        if (totalPlatinumTics.length != 0) {
            pltCount = totalPlatinumTics.length
        }
        let gldCount = 0
        if (totalGoldTics.length != 0) {
            gldCount = totalGoldTics.length
        }
        let slvrCount = 0
        if (totalSilverTics.length != 0) {
            slvrCount = totalSilverTics.length
        }
        let movieData = await movieModel.findById(movieID)
        let remainingPltTics = movieData.remainingPlatiniumTickets
        let remainingGldTics = movieData.remainingGoldTickets
        let remainingSlvrTics = movieData.remainingSilverTickets
        let flagPlat = false
        let flagGld = false
        let flagSlvr = false
        let platPresent = false
        let gldPresent = false
        let slvrPresent = false

        //check with platinum remailing tickets
        if (pltCount > 0) {
            let checkPltRemain = remainingPltTics - pltCount
            if (checkPltRemain >= 0) {
                flagPlat = true
                if (flagPlat) {
                    let bookedPlatiniumSeats = movieData.bookedPlatiniumSeats
                    let presentOrNot = false
                    for (let i = 0; i < totalPlatinumTics.length; i++) {
                        if (bookedPlatiniumSeats.includes(totalPlatinumTics[i])) {
                            presentOrNot = true
                            break
                        }
                    }
                    if (presentOrNot) {
                        platPresent = true
                    }
                }
            }
        }

        //check with gold tickets
        if (gldCount > 0) {
            let checkGldRemain = remainingGldTics - gldCount
            if (checkGldRemain >= 0) {
                flagGld = true
                if (flagGld) {
                    let bookdedGoldSeats = movieData.bookedGoldSeats
                    let presentOrNot = false
                    for (let i = 0; i < totalGoldTics.length; i++) {
                        if (bookdedGoldSeats.includes(totalGoldTics[i])) {
                            presentOrNot = true
                            break
                        }
                    }
                    if (presentOrNot) {
                        gldPresent = true
                    }
                }
            }
        }

        //check with silver tickets
        if (slvrCount > 0) {
            let checkSlvrRemain = remainingSlvrTics - slvrCount
            if (checkSlvrRemain >= 0) {
                flagSlvr = true
            }
            if (flagSlvr) {
                let bookedSilverSeats = movieData.bookedSilverSeats
                let presentOrNot = false
                for (let i = 0; i < totalSilverTics.length; i++) {
                    if (bookedSilverSeats.includes(totalSilverTics[i])) {
                        presentOrNot = true
                        break
                    }
                }
                if (presentOrNot) {
                    slvrPresent = true
                }
            }
        }

        //check possibilities for tickets for that seat available or not.
        if (totalPlatinumTics.length != 0 && flagPlat == false) {
            res.status(401).send({ "message": "Seats selected by you in platinium section is more than available seats" })
        } else if (totalGoldTics.length != 0 && flagGld == false) {
            res.status(401).send({ "message": "Seats selected by you in Gold section is more than available seats" })
        } else if (totalSilverTics.length != 0 && flagSlvr == false) {
            res.status(401).send({ "message": "Seats selected by you in Silver section is more than available seats" })
        } else if (platPresent) {
            res.status(401).send({ "message": "Some of selected seats by you in platinum section is already booked." })
        } else if (gldPresent) {
            res.status(401).send({ "message": "Some of selected seats by you in gold section is already booked." })
        } else if (slvrPresent) {
            res.status(401).send({ "message": "Some of selected seats by you in Silver section is already booked." })
        } else {

            if (flagPlat && platPresent == false) {
                let newPltArray = [...movieData.bookedPlatiniumSeats, ...totalPlatinumTics]
                let newPlatRemainingSeats = remainingPltTics - totalPlatinumTics.length
                await movieModel.findByIdAndUpdate(movieID, { bookedPlatiniumSeats: newPltArray, remainingPlatiniumTickets: newPlatRemainingSeats })
            }

            if (flagGld && gldPresent == false) {
                let newGldArray = [...movieData.bookedGoldSeats, ...totalGoldTics]
                let newGldRemainingSeats = remainingGldTics - totalGoldTics.length
                await movieModel.findByIdAndUpdate(movieID, { bookedGoldSeats: newGldArray, remainingGoldTickets: newGldRemainingSeats })
            }

            if (flagSlvr && slvrPresent == false) {
                let newSlvrArray = [...movieData.bookedSilverSeats, ...totalSilverTics]
                let newSlvrRemainingSeats = remainingSlvrTics - totalSilverTics.length
                await movieModel.findByIdAndUpdate(movieID, { bookedSilverSeats: newSlvrArray, remainingSilverTickets: newSlvrRemainingSeats })
            }

            let createdDate = new Date().toLocaleDateString()

            let newTicket = new ticketModel({
                userID: userID,
                movieID: movieID,
                platiniumTickets: totalPlatinumTics,
                goldTickets: totalGoldTics,
                silverTickets: totalSilverTics,
                createdDate: createdDate
            })
            await newTicket.save()
            res.status(200).send({ "message": "Tickets booked successfully." })
        }

    } catch (error) {
        console.log(error.message)
        res.status(400).send({ "message": "Sorry :( , Server Error" })
    }
})

//add tickets to cart
ticketRouter.post("/cart/add/:movieID", async (req, res) => {
    try {
        let data = req.body
        let userID = req.body.userID
        let movieID = req.params.movieID
        let newCart = new cartModel({
            userID: userID,
            movieID: movieID,
            platiniumTickets: data.platiniumTickets,
            goldTickets: data.goldTickets,
            silverTickets: data.silverTickets
        })
        await newCart.save()
        res.status(200).send({ "message": "Ticket added to the cart." })
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ "message": "Sorry :( , Server Error" })
    }
})


//remove tickets from the cart
ticketRouter.delete("/cart/remove/item/:movieID", async (req, res) => {
    try {
        let movieID = req.params.movieID
        await cartModel.deleteOne({ movieID: movieID })
        res.status(200).send({ "message": "Tickets remove from the cart" })
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ "message": "Sorry :( , Server Error" })
    }
})


// filter all movies in ascending 
ticketRouter.get("/filter/movies/ascending", async (req, res) => {
    try {
        let data = await movieModel.find({}).sort({ movieName: 1 })
        res.status(201).send({ "message": "data is filetered in ascending order", data: data })
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ "message": "Sorry :( , Server Error" })
    }
})

// filter all movies in descending 
ticketRouter.get("/filter/movies/descending", async (req, res) => {
    try {
        let data = await movieModel.find({}).sort({ movieName: -1 })
        res.status(201).send({ "message": "data is filetered in descending order", data: data })
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ "message": "Sorry :( , Server Error" })
    }
})

//search movies
ticketRouter.post("/search/movies", async (req, res) => {
    try {
        let searchQuery = req.body.searchQuery
        let data = await movieModel.find({ movieName: { $regex: new RegExp(searchQuery, 'i') } })
        res.status(201).send({ "message": "searched movie data", data: data })
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ "message": "Sorry :( , Server Error" })
    }
})

//get all items in cart
ticketRouter.get("/cart/all/items", async (req, res) => {
    try {
        let userID = req.body.userID
        let data = await cartModel.find({ userID: userID })
        let mainData = []
        for (let i = 0; i < data.length; i++) {
            let movieData = await movieModel.findById(data[i].movieID)
            let obj = { ...data[i] }
            obj._doc.movieName = movieData.movieName
            mainData.push(obj._doc)
        }
        res.status(201).send({ "message": "Elements present in cart", data: mainData })
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ "message": "Sorry :( , Server Error" })
    }
})



module.exports = {
    ticketRouter
}
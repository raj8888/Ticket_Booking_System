const express=require("express")
const {movieModel}=require("../models/movies.model")
const movieRouter=express.Router()
const {authorization}=require("../middlewares/authorization.middleware")
const {authenticator}=require("../middlewares/authenticator.middleware")

movieRouter.use(authenticator)

movieRouter.get("/all",authorization(['admin','user']),async(req,res)=>{
    try {
        let data=await movieModel.find()
        res.status(200).send({"message":"All movies",allData:data})
    } catch (error) {
            console.log(error.message)
            res.status(400).send({"message":"Sorry :( , Server Error"})
    }
})

movieRouter.post("/create",authorization(["admin"]),async(req,res)=>{
    try {
            let data=req.body
            let createdDate=new Date().toLocaleDateString()
            let newMovie=new movieModel({
                movieName:data.name,
                totalTickets:data.totalTickets,
                totalPlatiniumTickets:data.totalPlatiniumTickets,
                totalGoldTickets:data.totalGoldTickets,
                totalSilverTickets:data.totalSilverTickets,
                bookedPlatiniumSeats:[],
                bookedGoldSeats:[],
                bookedSilverSeats:[],
                openForSale:true,
                closingDate:data.closingDate,
                createdDate:createdDate
            })
            await newMovie.save()
            res.status(201).send({'message':"Movie Created Successfully!"})
    } catch (error) {
            console.log(error.message)
            res.status(400).send({"message":"Sorry :( , Server Error"})
    }
})

movieRouter.patch("/update/status/:movieID",authorization(['admin']),async(req,res)=>{
    try {
        let movieID=req.params.movieID
        await movieModel.findByIdAndUpdate(movieID,{openForSale:false})
        res.status(201).send({'message':"Tickets Sales Closed Successfully!"})
    } catch (error) {
            console.log(error.message)
            res.status(400).send({"message":"Sorry :( , Server Error"})
    }
})


movieRouter.delete("/delete/:movieID",authorization(['admin']),async(req,res)=>{
    try {
        let movieID=req.params.movieID
        await movieModel.findByIdAndDelete(movieID)
        res.status(201).send({'message':"Movie Deleted Successfully!"})
    } catch (error) {
            console.log(error.message)
            res.status(400).send({"message":"Sorry :( , Server Error"})
    }
})
module.exports={
    movieRouter
}

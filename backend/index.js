const express = require("express")
const cors = require("cors")
require('dotenv').config()

const { connection } = require("./config/db")
const { userRouter } = require("./routes/user.route")
const { movieRouter } = require("./routes/movies.route")
const { ticketRouter } = require("./routes/tickets.route")

const app = express()
app.use(express.json())
app.use(cors())
app.use("/users", userRouter)
app.use("/movies", movieRouter)
app.use("/tickets", ticketRouter)

app.get("/home", (req, res) => {
    res.status(200).send({ "Message": "Hello, Welcome to ticket booking system." })
})



app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("Connected To The DB")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`Port Is Listning On ${process.env.port}`)
})
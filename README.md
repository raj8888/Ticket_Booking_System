#  Ticket Booking System

Ticket Booking is a simple ticket booking system. Where from admin side admin can create movie with seat and tickets. And user can book tickets or select seats and add to cart.


## Features

- Authentication
- Authorization
- Tikcet System
- Create a movies with seats and tickets.
- Book Tickets
- Seats and Tickets arranged in section wise.(Platinum section, Gold section, Silver section)
- Add tickets to cart
- Close ticket selling.


## Tech Stack

**Client:** HTML, CSS, JavaScript, React.

**Server:** Node.js, Express.js,Mongoose.

**Database:** MongoDB.

## Run Locally

Clone the project

```bash
  git clone https://github.com/raj8888/Ticket_Booking_System
```

Go to the project directory

```bash
  cd Ticket_Booking_System
```

Install dependencies

```bash
  npm install
```

Start the server (Download nodemon npm library globally)

```bash
  npm install -g nodemon
```

```bash
  nodemon index.js
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MongoURL`

`port`

`seckey`



## API Reference

#### Welcome

```http
  GET /api
```

## For Login And Registration


#### User Register

```http
  POST /api/users/register
```

#### User Login

```http
  POST /api/users/login
```

## For Tickets


#### For Confirm Booking of Tickets

```http
  POST /api/tickets/book/movie/:movieID
```

#### For Add To Cart

```http
  POST /api/tickets/cart/add/:movieID
```

#### Remove Tickets From Cart

```http
  DELETE /api/tickets/cart/remove/item/:movieID
```

#### Filter All Movies In Ascending 

```http
  GET /api/ticktes/filter/movies/ascending
```


#### Filter All Movies In Descending 

```http
  GET /api/ticktes/filter/movies/descending
```


#### Search Movies

```http
  POST /api/tickets/search/movies
```


#### Get All Items In Cart
```http
  GET /api/tickets/cart/all/items
```

### For Admin
**Following Routes Accessible For Admin Only**


#### Get All Movies 
**Only This Route Accessible By User Also**
```http
  GET /api/movies/all
```

#### Get Selected Movies

```http
  GET /api/movies/single/:movieID
```


#### Create Ticktes
**Admin Can select How much Tickets will be created For Each Section**


```http
  POST api/movies/create
```


#### Fot Update Status Of Movie
**Ticket Selling Closed or Open**

```http
  PATCH /api/movies/update/status/:movieID
```

#### Fot Delete movie

```http
  DELETE /api/movies/delete/:movieID
```


**Authentication Required All Routes Except Login and Register**

### User Schema Ref:
```
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    createdDate: String,
    password: String,
    role: String,
})
```

### Movies Schema Ref:
```
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
```


### Ticket Schema Ref:
```
const ticketSchema = mongoose.Schema({
    userID: { type: mongoose.ObjectId, ref: 'Users' },
    movieID: { type: mongoose.ObjectId, ref: 'Movies' },
    platiniumTickets: { type: [String] },
    goldTickets: { type: [String] },
    silverTickets: { type: [String] },
    createdDate: String
})
```


### Cart Schema Ref:
```
const cartSchema = mongoose.Schema({
    userID: { type: mongoose.ObjectId, ref: 'Users' },
    movieID: { type: mongoose.ObjectId, ref: 'Movies' },
    platiniumTickets: { type: [String] },
    goldTickets: { type: [String] },
    silverTickets: { type: [String] }
})
```

## Screenshots

Registration Form:

![App Screenshot](https://i.ibb.co/9bxFrdm/Screenshot-367.png)


Login Form:

![App Screenshot](https://i.ibb.co/7nVKZNM/Screenshot-368.png)


User Dashboard:

![App Screenshot](https://i.ibb.co/ZG9cGd3/Screenshot-371.png)

Admin Dashboard:

![App Screenshot](https://i.ibb.co/2v6rFjp/Screenshot-369.png)

Create Movies with Tickets and Seats:(For Admin)

![App Screenshot](https://i.ibb.co/BjCfktG/Screenshot-370.png)

Single Movie Information:(With See all Seats And Tickets)

 - Red color represent Platinum
 - Yellow color represent Gold
 - Grey color represent Silver
 - If background colors in Dark form then this seats are already booked.
 - If background colors in Faint form then this seats are selected by user.
 - If User click on add to cart then selected seat by user will be added in cart.
 - If User Click on Book Seats then it will check in backend if this seats are already booked or not then it will show alert according to than
 
![App Screenshot](https://i.ibb.co/DM5t1dj/Screenshot-372.png)

Cart Section:

![App Screenshot](https://i.ibb.co/gSS1rsR/Screenshot-373.png)



## Sample Accounts

### For Admin
- EmailID : jadhavrj8877@gmail.com
- Password: Raj@8080680

### For User
- EmailID : chunnu@gmail.com
- Password: chunnu

## Live Demo

[https://ticket-booking-system.netlify.app/](https://ticket-booking-system.netlify.app/)

## Backend Deployed Demo

[
https://strange-ruby-pajamas.cyclic.app](
https://strange-ruby-pajamas.cyclic.app)

## Author

- [@raj8888](https://github.com/raj8888)


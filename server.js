///////////////////////////////
// DEPENDENCIES
////////////////////////////////

require("dotenv").config();
const { PORT = 3000, DATABASE_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");


///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  // Connection Events
  mongoose.connection
    .on("open", () => console.log("Your are connected to mongoose"))
    .on("close", () => console.log("Your are disconnected from mongoose"))
    .on("error", (error) => console.log(error));


///////////////////////////////
// MODELS
////////////////////////////////
const ExpenseSchema = new mongoose.Schema({
    date: Number,
    category: String,
    amount: Number,
    description: String,
  });
  
  const Expense = mongoose.model("Expense", ExpenseSchema);


///////////////////////////////
// MIDDLEWARE
////////////////////////////////
// Importing cors/morgans for security API. 
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies


///////////////////////////////
// ROUTES
////////////////////////////////

app.get("/", (req, res) => {
  res.send("Hello world");
});

///////////////////////////////
// LISTENER
////////////////////////////////

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));

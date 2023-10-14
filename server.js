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
const methodOverride = require('method-override')

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
app.use(methodOverride('_method'))


///////////////////////////////
// ROUTES
////////////////////////////////

app.get("/", (req, res) => {
  res.send("Hello world");
});

// EXPENSE INDEX ROUTE
app.get("/expense", async (req, res) => {
    try {
      // send all expense
      res.json(await Expense.find({}));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // EXPENSE CREATE ROUTE
  app.post("/expense", async (req, res) => {
    try {
      // send all expense
      res.json(await Expense.create(req.body));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // EXPENSE Update ROUTE
  app.put("/expense/:id", async (req, res) => {
    try {
      // send all expense
      res.json(
        await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // EXPENSE Destroy ROUTE
  app.delete("/expense/:id", async (req, res) => {
    try {
      // send all expense
      res.json(await Expense.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

///////////////////////////////
// LISTENER
////////////////////////////////

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));

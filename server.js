///////////////////////////////
// DEPENDENCIES
////////////////////////////////

// laods environoment variables from .env file
require("dotenv").config();
const bcrypt = require('bcrypt');
const expressSession = require('express-session');
const User = require('./user_model'); // User model
const { PORT = 4000, DATABASE_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// cors is needed for authorized resource sharing with external third parties
const cors = require("cors");
// Define CORS options
const corsOptions = {
  origin: "http://localhost:4000", // Replace with the URL of your React app
  credentials: true, // This allows cookies and authentication headers to be sent with the request
};



// log requests made to your Node. js server
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
    date: Date,
    category: {
      type: String,
      enum: ['bills', 'shopping', 'groceries', 'entertainment', 'miscellaneous'],
    },
    amount: Number,
    description: String,
  });
  
  const Expense = mongoose.model("Expense", ExpenseSchema);


///////////////////////////////
// MIDDLEWARE
////////////////////////////////
// Importing cors/morgans for security API. 
// app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies
app.use(methodOverride('_method'))


// Use express-session middleware for session handling
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET, // A secret key for session encryption
    resave: false,
    saveUninitialized: false,
  })
);

// Configure CORS with appropriate options
app.use(cors(corsOptions))
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
  

// save user information to the session

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
  



  app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
      // Hash the user's password
      const hashedPassword = bcrypt.hashSync(password, 10); // Use an appropriate number of salt rounds
      // Create a new user
      const user = await User.create({ username, password: hashedPassword });
      // Store user information in the session
      req.session.user = user;
      res.json({ user });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: 'Registration failed' });
    }
  });
  
  

// User login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json('Username and password do not match. Please try again.');
    } else if (bcrypt.compareSync(password, user.password)) {
      // Store user information in the session
      req.session.user = user;
      res.json({ username: user.username });
    } else {
      res.status(400).json('Username and password do not match. Please try again.');
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

// User logout route
app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.json({ message: 'Logout successful' });
    }
  });
});

// Get Gif
app.get('/gif', (req, res) => {
  const apikey = "yQvc38UnbbCTFlMU6wuJJO1R9sJluJjX"

  const randomGifGen = () => {
    return Math.floor(Math.random() * 25);
  } 

  try {
    fetch("https://api.giphy.com/v1/gifs/search?api_key=yQvc38UnbbCTFlMU6wuJJO1R9sJluJjX&q=Sad&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips", {
        method: 'GET', // or 'POST', depending on the API
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apikey}` // or 'ApiKey YOUR_API_KEY' depending on the API
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        res.json((data.data[randomGifGen()].images.original.url));
    })
    .catch(error => {
        console.error('There was an error fetching the data:', error);
    });
  } catch (error) {
    res.status(400).json(error);
  }
})


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
  
//UPDATE Budget
  app.put('/expense/budget', async (req, res) => {
    try {
      // Update the budget
      const newBudget = req.body.budget;
      // You can store this budget value in your server or database as needed
      // For example, in a variable or database.
  
      res.status(200).json({ message: 'Budget updated successfully' });
    } catch (error) {
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

app.listen(PORT, () => console.log(`listening on PORT http://localhost:${PORT}/`));

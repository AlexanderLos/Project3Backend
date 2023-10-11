////////////////////////
// DEPENDENCIES
////////////////////////

require("dotenv").config();

const { DATABASE_URL, PORT = 3000 } = process.env

const express = require('express')

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config({});
const connectDB = require("./config/db");
const authRoute = require("./routes/auth.route");
const compression = require("compression");
const hpp = require("hpp"); // Middleware to protect against HTTP Parameter Pollution attacks
const mongoSanitize = require("express-mongo-sanitize"); // Middleware to sanitize data from query injection
const xss = require("xss-clean"); // Middleware to sanitize data from scripting attacks
const globalError = require("./middlewares/globalError");


// Connect to MongoDB
connectDB();


const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true); // Accept all origins
    },
    credentials: true, // Allow credentials (cookies)
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(compression()); // Compress all routes



// Apis
app.use("/api/v1/auth", authRoute);

app.use(globalError);

app.listen(8080, () => {
    console.log(`Server is running on http://localhost:8080`);
});

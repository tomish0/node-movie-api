const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const chalk = require("chalk");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");

require("dotenv").config();
const hostname = "127.0.0.1";
const port = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(cors());
app.use(morgan("combined"));
app.use(helmet());
app.use(bodyParser.json());
app.use(limiter);
app.use(express.static("public"));

app.use("/movie", require("./routes/movie"));

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

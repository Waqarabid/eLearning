import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
const morgan = require("morgan");
require("dotenv").config();

// create express app
const app = express();

// apply middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
readdirSync("./routes").map((routesFile) =>
  app.use("/api", require(`./routes/${routesFile}`))
);

// port
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

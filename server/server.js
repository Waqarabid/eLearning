import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
import mongoose from "mongoose";
const morgan = require("morgan");
require("dotenv").config();

// create express app
const app = express();

// db
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("**DB connected**"))
  .catch((err) => console.log("DB CONNECTION ERROR: ", err));

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

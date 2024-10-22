const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/routes");
require("dotenv").config(); 
const app = express();
app.use(cors())
app.use(express.json());
const PORT = process.env.PORT || 5000;
const PASSWORD = process.env.PASSWORD;

mongoose
  .connect('mongodb+srv://nanianantha07:JGfObgVtgfCL8sDQ@cluster0.khgew.mongodb.net/test')
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", router);

app.listen("5000", () => {
  console.log("App is running on port 5000");
});


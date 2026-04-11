require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/uploads", express.static("uploads"));
server.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);
const path = require("path");

const express = require("express");
const cors = require("cors");

const errorController = require("./controllers/error");
// const mongoConnect = require("./util/database").mongoConnect;

const app = express();
app.use(express.json());
app.use(cors());

const mongoose = require("mongoose");

const couriersRoute = require("./routes/couriersRoute");
const customersRoute = require("./routes/customersRoute");
const ordersRoute = require("./routes/ordersRoute");
const productsRoute = require("./routes/productsRoute");
const usersRoute = require("./routes/usersRoute");
const storeRoute = require("./routes/storeRoute");
const employeeRoute = require("./routes/employeeRoute");
const supplierRoute = require("./routes/supplierRoute");
const userLogsRoute = require("./routes/userLogsRoute");
// const errorController = require("./controllers/error");

// app.use(express.static(path.join(__dirname, "public")));

app.use("/courier", couriersRoute);
app.use("/customer", customersRoute);
app.use("/order", ordersRoute);
app.use("/product", productsRoute);
app.use("/user", usersRoute);
app.use("/store", storeRoute);
app.use("/employee", employeeRoute);
app.use("/supplier", supplierRoute);
app.use("/userlog", userLogsRoute);

// app.use(errorController.get404);

mongoose.connect(
  "mongodb+srv://inventoryApp:2WgofgBZ2dp1HzZU@cluster0.cwkrobe.mongodb.net/?retryWrites=true&w=majority",
  { dbName: "inventory-app" }
);

db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
  // app.listen(3000);
});

module.exports = app;

const express = require("express");

const route = require("./route/route.js");

const app = express();

app.use(express.json());

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://debojit:rJuLc4nyipWKU6tV@cluster1.31noc.mongodb.net/group70Database-DB"
  )
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log(err));

app.use("/", route);
app.all("*", function (req, res) {
  throw new Error("Bad Request");
});
app.use(function (e, req, res, next) {
  if (e.message == "Bad Request")
    return res.status(400).send({ error: e.message });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});

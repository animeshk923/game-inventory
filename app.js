const express = require("express");
const app = express();
const path = require("node:path");
const assetsPath = path.join(__dirname, "public");
const appRoute = require("./routes");

app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", appRoute);

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}/`);
});

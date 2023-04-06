const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/weather", require("./routes/weather"));
app.use("/chat", require("./routes/chat"));

app.get("/", (req, res) => {
  res.json("Welcome to the latest and greatest weather tracker.");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Weather tracker is listening on port ${PORT}`);
});

const express = require("express");

const app = express();

app.get("/", (request, response) => {
  response.send("<h1>Welcome home!</h1>");
});

const PORT = 3001

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});
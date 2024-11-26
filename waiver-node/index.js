const express = require("express");
const app = express();
const port = 5050;

app.listen(port, () => {
  console.log(`app running on port: ${port}..`);
});

app.get('/', (req, res) => {
    res.send('hello word').status(200);
})
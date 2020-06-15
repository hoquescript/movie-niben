const mongoose = require("mongoose");
const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");

mongoose
    .connect("mongodb://localhost/movie-niben")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

const app = express();

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));



// import server and mongodb ODM
const express = require('express');
const mongoose = require('mongoose');

// create server
const app = express();
const PORT = process.env.PORT || 3001;

// middleware to handle json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// reroutes any requests to ./routes folder
app.use(require('./routes'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-hunt', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Use this to log mongo queries being executed!
mongoose.set('debug', true);

app.listen(PORT, () => console.log(`Connected on localhost:${PORT}`));
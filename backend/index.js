const express = require('express');
const cors = require('cors');

const app = express();

// Config JSON
app.use(express.json());

// Config CORS
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

// Public folders for images
app.use(express.static('public'));

// Routes


app.listen(5000);

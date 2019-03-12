require('dotenv').config();

const express       = require('express');
const app           = express();

const NewsRoute     = require('./routes/news');

app.use('/news', NewsRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running in ${PORT}`)
})
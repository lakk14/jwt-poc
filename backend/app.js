const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const createError = require('http-errors')
require('./helpers/init_redis');
const morgan = require('morgan');

const userRoute = require('./Routes/User.route');
const authRoute = require('./Routes/Auth.route');

require('./helpers/init_mongodb');

app.use(morgan('dev')); //dev purpose

app.use(cors());  //Handling Cors error

//Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.use('/api', authRoute);
app.use('/api/user', userRoute);


app.use(async (req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
})

app.listen(3200, () => { console.log("backend started"); });

module.exports = app;
const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const path = require('path');
const staticAsset = require('static-asset');
const mongoose = require('mongoose');
const config = require('./config');
// const authRoute = require('./routes/api/auth');
const routes = require('./routes/router');

mongoose.Promise = global.Promise;
mongoose.set('debug', true);

mongoose.connection
    .on('error', error => console.log(error))
    .on('close', () => console.log("database connection closed"))
    .once('open', () => {
        const info = mongoose.connections[0];
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    });

mongoose.connect(config.MONGO_URL, {useNewUrlParser: true});

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(staticAsset(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/javascripts',
  express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

app.get('/', function (req, res) {
    res.render('index');
});

app.use('/api/auth', routes.authRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.render('error', {
        message: error.message,
        error: !config.IS_PRODUCTION ? error : {}
    });
});

app.listen(config.PORT, () => {
    console.log('App started');
});

var express = require('express');
var router = express.Router();
const got = require('got');
const url = require('url');

const appConfig = require('../app_config');

function getCountry(sendObject) {
    return new Promise((resolve, reject) => {
        got(appConfig.COUNTRY_API_URL + sendObject.weather.sys.country)
            .then((response) => {
                var countryInfo = JSON.parse(response.body);
                sendObject.country = countryInfo;
                resolve(sendObject);
            })
            .catch((err) => {
                sendObject.err = err;
                reject(sendObject);
            })
    })
}

function getWeather(city, res) {
    return new Promise((resolve, reject) => {
        const query = new url.URLSearchParams([['q', city], ['appid', appConfig.API_ID]]);

        got(appConfig.WEATHER_URL, { query })
            .then((response) => {
                var weather = JSON.parse(response.body);
                resolve({
                    res: res,
                    weather: weather
                });
            })
            .catch((err) => {
                reject({
                    res: res,
                    err: err
                });
            })
    })
}

function renderResponse(sendObject) {
    sendObject.res.render('weather', sendObject);
}

function jsonResponse(sendObject) {
    var response = {
        weather: sendObject.weather,
        country: sendObject.country
    }
    sendObject.res.json(response);
}

function sendError(sendObject) {
    //sendObject.res.json(sendObject.err);
    sendObject.res.send("Nie znaleziono takiego miasta. " + sendObject.err.statusCode + " " + sendObject.err.statusMessage);
}

router.get('/weather/:city', (req, res) => {
    let info = {};
    getWeather(req.params.city, res)
        .then(getCountry)
        .then(renderResponse)
        .catch(sendError);
});

router.get('/weatherj/:city', (req, res) => {
    let info = {};
    getWeather(req.params.city, res)
        .then(getCountry)
        .then(jsonResponse)
        .catch(sendError);
});

module.exports = router;

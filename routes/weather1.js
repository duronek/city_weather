var express = require('express');
var router = express.Router();
const got = require('got');
const url = require('url');

const appConfig = require('../app_config');

function getCountry(code) {
  return new Promise((resolve, reject) => {
    got(appConfig.COUNTRY_API_URL + code)
      .then((response) => {
        var countryInfo = JSON.parse(response.body);
        resolve(countryInfo);
      })
      .catch((err) => {
        reject(err);
      })
  })
}

function getWeather(city) {
  return new Promise((resolve, reject) => {
    const query = new url.URLSearchParams([['q', city], ['appid', appConfig.API_ID]]);

    got(appConfig.WEATHER_URL, { query })
      .then((response) => {
        var weather = JSON.parse(response.body);
        resolve(weather);
      })
      .catch((err) => {
        reject(err);
      })
  })
}

router.get('/weather/:city', function (req, res, next) {
  let info = {};
  getWeather(req.params.city)
    .then((weather) => {
      info.weather = weather;
      getCountry(info.weather.sys.country)
        .then((countryInfo) => {
          info.country = countryInfo;
          res.render('weather', info);
        })
        .catch((err) => {
          res.json(err);
        })
    })
    .catch((err) => {
      res.json(err);
    })
});

router.get('/weatherj/:city', function (req, res, next) {
  let info = {};
  getWeather(req.params.city)
    .then((weather) => {
      info.weather = weather;
      getCountry(info.weather.sys.country)
        .then((countryInfo) => {
          info.country = countryInfo;
          res.json(info);
        })
        .catch((err) => {
          res.json(err);
        })
    })
    .catch((err) => {
      res.json(err);
    })
});

module.exports = router;

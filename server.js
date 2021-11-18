import express from 'express'
const app = express()
// const cors = require('cors')
import cors from 'cors'
app.use(cors())
app.use(express.json())
import dotenv from 'dotenv'
dotenv.config()
import fetch from 'node-fetch'
app.set('port', process.env.PORT || 3001);

const geoDBkey = process.env.GEODB_KEY;
const walkScoreKey = process.env.WALKSCORE_KEY;

app.get('/geoDB/:minPopulation', (request, response) => {
  const minPopulation = request.params.minPopulation
   fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=20&countryIds=Q30&minPopulation=${minPopulation}`, {
            "method": "GET",
            "headers": {
              "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
              "x-rapidapi-key": geoDBkey,
            }
   })
   .then(externalResponse => {
    if (!externalResponse.ok) {
      throw new Error(`Status: ${externalResponse.status} message: ${externalResponse.statusText}`)
    }
    return externalResponse.json()
  })
  .then(data => response.status(200).json(data))
  .catch(error => response.send( { error: error } ))
})

app.get('/wiki/:fetchQuery', (request,response) => {
  const fetchQuery = request.params.fetchQuery
  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${fetchQuery}`)
  .then(externalResponse => {
    if (!externalResponse.ok) {
      throw new Error(`Status: ${externalResponse.status} message: ${externalResponse.statusText}`)
    }
    return externalResponse.json()
  })
  .then(data => response.status(200).json(data))
  .catch(error => response.send( { error } ))
})

app.get('/walkScores/:city/:state/:lat/:lon', (request, response) => {
  const city = request.params.city
  const state = request.params.state
  const latitude = request.params.lat
  const longitude = request.params.lon
  fetch(`https://api.walkscore.com/score?format=json&address=${city}%20${state}&lat=${latitude}&lon=${longitude}&transit=1&bike=1&wsapikey=${walkScoreKey}`)
  .then(externalResponse => {
    if (!externalResponse.ok) {
      throw new Error(`Status: ${externalResponse.status} message: ${externalResponse.statusText}`)
    }
    return externalResponse.json()
  })
  .then(data => response.status(200).json(data))
  .catch(error => response.send( { error } ))
})

app.listen(app.get('port'), () => {
  console.log(`Environment api keys variables over on http://localhost:${app.get('port')}`)
})